import "./App.css";
import React, { useState, useEffect } from "react";

const ledgerData = {
  name: "21Bitcoin App",
  idempotence_key: "21bitcoin",
};

const accountData = {
  "21bitcoin_asset_cash_in_bank": {
    name: "Cash in Bank",
    currency: "EUR",
    type: "asset",
    path: "asset/cash_in_bank",
    ledger: { ikey: "21bitcoin" },
    idempotence_key: "21bitcoin_asset_cash_in_bank",
    balance: 0,
    entries: [],
  },
  "21bitcoin_income_fee": {
    name: "Revenue Fee",
    currency: "EUR",
    type: "income",
    path: "income/fee",
    ledger: { ikey: "21bitcoin" },
    idempotence_key: "21bitcoin_income_fee",
    balance: 0,
    entries: [],
  },
  "21bitcoin_expense_bank_fee": {
    name: "Bank Txn Fee",
    currency: "EUR",
    type: "expense",
    path: "expense/bank_fee",
    ledger: { ikey: "21bitcoin" },
    idempotence_key: "21bitcoin_expense_bank_fee",
    balance: 0,
    entries: [],
  },
  "21bitcoin_liability_payables_user:userA": {
    name: "User A Wallet",
    currency: "EUR",
    type: "liability",
    path: "liability/payables/user:userA",
    ledger: { ikey: "21bitcoin" },
    idempotence_key: "21bitcoin_liability_payables_user:userA",
    balance: 0,
    entries: [],
  },
  "21bitcoin_liability_payables_user:userB": {
    name: "UserB Wallet",
    currency: "EUR",
    type: "liability",
    path: "liability/payables/user:userB",
    ledger: { ikey: "21bitcoin" },
    idempotence_key: "21bitcoin_liability_payables_user:userB",
    balance: 0,
    entries: [],
  },
};

const userAccounts = [
  "21bitcoin_liability_payables_user:userA",
  "21bitcoin_liability_payables_user:userB",
];

const TransactionPage = () => {
  const [ledger, setLedger] = useState(null);
  const [accounts, setAccounts] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [token, setToken] = useState(null);
  const [amount, setAmount] = useState(0);
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);
  const [transactionType, setTransactionType] = useState("add_money");
  const [chargeFee, setChargeFee] = useState(false);
  // const [bankFee, setBankFee] = useState(false);

  const API_HOST = process.env.API_HOST || "http://localhost:4004/api";

  const fetchEntries = async (accountId) => {
    const response = await fetch(
      `${API_HOST}/ledger/entry?account_id=${accountId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    return data.results;
  };

  const fetchBalance = async (accountId) => {
    const response = await fetch(`${API_HOST}/ledger/account/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data.balance;
  };

  // Fetch Token
  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch(`${API_HOST}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: "00000000-0000-0000-0000-000000000000",
          client_secret: "00000000-0000-0000-0000-000000000000",
        }),
      });
      const data = await response.json();
      setToken(data.access_token);
    };

    fetchToken();
  }, []);

  // Create Ledger
  useEffect(() => {
    if (!token) return;
    const createLedger = async () => {
      const response = await fetch(`${API_HOST}/ledger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ledgerData),
      });
      const data = await response.json();
      setLedger(data);
    };

    createLedger();
  }, [token]);

  // Create All Accounts and Store Actual IDs
  useEffect(() => {
    if (!ledger) return;

    const createAccounts = async () => {
      const newAccounts = {};
      for (const key of Object.keys(accountData)) {
        const response = await fetch(`${API_HOST}/ledger/account`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(accountData[key]),
        });
        const data = await response.json();

        const entries = await fetchEntries(data.id);

        newAccounts[data.idempotence_key] = {
          ...data,
          originalKey: key,
          entries,
        }; // Store actual backend ID
      }

      setAccounts(newAccounts);
    };

    createAccounts();
  }, [ledger]);

  useEffect(() => {
    if (!ledger) return;

    fetchTransactions();
  }, [ledger]);

  // Fetch Transactions
  const fetchTransactions = async () => {
    if (!ledger) return;

    const response = await fetch(
      `${API_HOST}/ledger/transaction?ledger_id=${ledger.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setTransactions(data.results);

    // Update account balances and entries
    const updatedAccounts = { ...accounts };
    for (const key of Object.keys(updatedAccounts)) {
      const entries = await fetchEntries(updatedAccounts[key].id);
      const balance = await fetchBalance(updatedAccounts[key].id);
      updatedAccounts[key].entries = entries;
      updatedAccounts[key].balance = balance;
    }

    setAccounts(updatedAccounts);
  };

  // Create Transaction
  const createTransaction = async () => {
    if (amount <= 0) return;

    const transactionPayload = {
      ledger: { ikey: "21bitcoin" },
      description:
        transactionType === "add_money" ? "Add Money" : "Withdraw Money",
      idempotence_key: `txn_${Date.now()}`,
      posted_at: new Date().toISOString(),
      tags: { type: transactionType },
      lines: [],
    };

    if (transactionType === "transfer") {
      transactionPayload.description = "Wallet Transfer";

      if (!fromAccount || !toAccount) return;
      transactionPayload.lines.push(
        {
          amount: amount * -1,
          currency: "EUR",
          account: { ikey: fromAccount },
        },
        { amount, currency: "EUR", account: { ikey: toAccount } }
      );
    } else {
      if (!toAccount) return;

      let txnAmount = amount;
      let feeAmount = 0;

      if (chargeFee) {
        feeAmount = 1;

        transactionPayload.lines.push({
          amount: feeAmount, // Flat 1€
          currency: "EUR",
          account: { ikey: "21bitcoin_income_fee" },
        });
      }

      if (transactionType === "withdraw_money") {
        txnAmount = txnAmount * -1;
      }

      transactionPayload.lines.push({
        amount: txnAmount,
        currency: "EUR",
        account: { ikey: "21bitcoin_asset_cash_in_bank" },
      });

      transactionPayload.lines.push({
        amount: txnAmount - feeAmount,
        currency: "EUR",
        account: { ikey: toAccount },
      });
    }

    const response = await fetch(`${API_HOST}/ledger/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transactionPayload),
    });

    const data = await response.json();
    console.log("Transaction Created:", data);
    fetchTransactions();
  };

  return (
    <div className="transaction-container">
      <h2>21Bitcoin Ledger</h2>

      {/* Accounts Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {Object.keys(accounts).map((key) => (
                <th key={key}>{accounts[key].name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.keys(accounts).map((key) => (
                <td key={key}>
                  <div>
                    <strong>€ {accounts[key].balance}</strong>
                  </div>
                  <div>
                    <ul>
                      {accounts[key].entries.length === 0 ? (
                        <li>No entries.</li>
                      ) : (
                        accounts[key].entries.map((entry, index) => (
                          <li key={index}>
                            {entry.description}: {entry.amount}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="form-history-container">
        <div className="form-section">
          <h3>Create Transaction</h3>
          <form className="transaction-form">
            <div className="form-group">
              <label>Transaction Type</label>
              <select
                onChange={(e) => setTransactionType(e.target.value)}
                required
              >
                <option value="add_money">Add Money</option>
                <option value="withdraw_money">Withdraw Money</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>

            {transactionType === "transfer" && (
              <>
                <div className="form-group">
                  <label>From Account</label>
                  <select
                    onChange={(e) => setFromAccount(e.target.value)}
                    required
                  >
                    <option value="">Select Account</option>
                    {userAccounts.map((userAccount) => {
                      return (
                        accountData[userAccount] && (
                          <option key={userAccount} value={userAccount}>
                            {accountData[userAccount].name}
                          </option>
                        )
                      );
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label>To Account</label>
                  <select
                    onChange={(e) => setToAccount(e.target.value)}
                    required
                  >
                    <option value="">Select Account</option>
                    {userAccounts.map((userAccount) => {
                      return (
                        accountData[userAccount] && (
                          <option key={userAccount} value={userAccount}>
                            {accountData[userAccount].name}
                          </option>
                        )
                      );
                    })}
                  </select>
                </div>
              </>
            )}

            {(transactionType === "add_money" ||
              transactionType === "withdraw_money") && (
              <div className="form-group">
                <label>Account</label>
                <select onChange={(e) => setToAccount(e.target.value)} required>
                  <option value="">Select Account</option>
                  {userAccounts.map((userAccount) => {
                    return (
                      accountData[userAccount] && (
                        <option key={userAccount} value={userAccount}>
                          {accountData[userAccount].name}
                        </option>
                      )
                    );
                  })}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                required
              />
            </div>

            {transactionType !== "transfer" && (
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={chargeFee}
                    onChange={(e) => setChargeFee(e.target.checked)}
                  />
                  Charge Fee (Flat 1€)
                </label>
              </div>
            )}

            <div className="form-group">
              <button type="button" onClick={createTransaction}>
                Execute Transaction
              </button>
            </div>
          </form>
        </div>

        <div className="transaction-history">
          <h3>Transaction History</h3>
          <ul>
            {transactions.length === 0 ? (
              <li>No transactions.</li>
            ) : (
              transactions.map((txn, index) => (
                <li key={index}>
                  {txn.description}: {txn.idempotence_key}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
