import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { UuidEntity } from "../../../core/base.entity";
import { Ledger } from "./ledger.entity";
import { AmountUtils } from "../../../utils/amount.utils";

export enum LedgerAccountType {
  ASSET = "asset",
  EXPENSE = "expense",
  INCOME = "income",
  LIABILITY = "liability",
}

@Entity({ name: "ledger_account" })
export class LedgerAccount extends UuidEntity {
  @ManyToOne(() => Ledger, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ledger_id" })
  ledger: Ledger; // Foreign key reference to Ledger

  @Column({ type: "varchar", length: 300 })
  name: string;

  @Column({ type: "varchar", length: 50, unique: true })
  idempotence_key: string; // idempotence key for duplicate prevention

  @Column({ type: "bigint", default: 0 })
  version: number; //version for tracking changes

  @Column({ type: "bigint", default: 0 })
  balance: number; // balance stored in minor units (e.g., cents)

  @Column({ type: "varchar", length: 4 })
  currency: string; // ISO 4217 currency code (e.g., USD, EUR)

  @Column({ type: "enum", enum: LedgerAccountType })
  type: LedgerAccountType; // Enum for account type

  @Column({ type: "varchar", length: 500 })
  path: string; // Hierarchical path for account structure

  get balanceInOriginalUnit(): number {
    return AmountUtils.toOriginalUnit(this.balance, this.currency);
  }

  toJSON() {
    return {
      ...this,
      balance: this.balanceInOriginalUnit,
    };
  }
}
