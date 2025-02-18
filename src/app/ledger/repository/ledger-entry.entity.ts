import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";

import { UuidEntity } from "../../../core/base.entity";
import { LedgerAccount } from "./ledger-account.entity";
import { LedgerTransaction } from "./ledger-transaction.entity";
import { Ledger } from "./ledger.entity";
import { AmountUtils } from "../../../utils/amount.utils";

@Entity({ name: "ledger_entry" })
export class LedgerEntry extends UuidEntity {
  @ManyToOne(() => Ledger, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ledger_id" })
  ledger: Ledger; // Foreign key reference to Ledger

  @Column({ type: "varchar", length: 1000 })
  description: string;

  @ManyToOne(() => LedgerAccount, { onDelete: "CASCADE" })
  @JoinColumn({ name: "account_id" })
  account: LedgerAccount; // Foreign key reference to LedgerAccount

  @ManyToOne(() => LedgerTransaction, { onDelete: "CASCADE" })
  @JoinColumn({ name: "transaction_id" })
  transaction: LedgerTransaction; // Foreign key reference to LedgerTransaction

  @Column({ type: "bigint" })
  amount: number; // Amount stored in minor units (e.g., cents)

  @Column({ type: "varchar", length: 4 })
  currency: string; // ISO 4217 currency code (e.g., USD, EUR)

  @Column({ type: "timestamptz" })
  posted_at: Date; // The timestamp when the transaction was recorded

  @Column({ type: "bigint", default: 0 })
  account_version: number;

  @BeforeInsert()
  @BeforeUpdate()
  convertAmountToSmallestUnit() {
    this.amount = AmountUtils.toSmallestUnit(this.amount, this.currency);
  }

  get amountInOriginalUnit(): number {
    return AmountUtils.toOriginalUnit(this.amount, this.currency);
  }

  toJSON() {
    return {
      ...this,
      amount: this.amountInOriginalUnit,
    };
  }
}
