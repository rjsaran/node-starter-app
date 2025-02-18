import { inject, injectable } from "inversify";
import { LedgerEntryService } from "./ledger-entry.service";
import { TYPES } from "../../../core/types";
import { LedgerAccountType } from "../repository/ledger-account.entity";

@injectable()
export class LedgerReportService {
  constructor(
    @inject(TYPES.LedgerEntryService)
    private readonly ledgerEntryService: LedgerEntryService
  ) {}

  async generateReportByDay(ledgerId: string, date: Date) {
    const ledgerEntries = await this.ledgerEntryService.findAllByLedgerAndDate(
      ledgerId,
      date
    );

    // Aggregate by account type
    let totals = {
      asset: 0,
      liability: 0,
      income: 0,
      expense: 0,
    };

    ledgerEntries.forEach((ledgerEntry) => {
      switch (ledgerEntry.account.type) {
        case LedgerAccountType.ASSET:
          totals.asset += ledgerEntry.amount;
          break;
        case LedgerAccountType.LIABILITY:
          totals.liability += ledgerEntry.amount;
          break;
        case LedgerAccountType.INCOME:
          totals.income += ledgerEntry.amount;
          break;
        case LedgerAccountType.EXPENSE:
          totals.expense += ledgerEntry.amount;
          break;
      }
    });

    // Validate the accounting equation: Asset - Liability === Income - Expense
    const lhs = totals.asset - totals.liability;
    const rhs = totals.income - totals.expense;
    const discrepancy = lhs !== rhs;

    return {
      date,
      totals,
      isBalanced: !discrepancy,
      discrepancyAmount: discrepancy ? lhs - rhs : 0,
    };
  }
}
