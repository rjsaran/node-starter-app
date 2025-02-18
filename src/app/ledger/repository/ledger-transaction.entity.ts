import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";

import { UuidEntity } from "../../../core/base.entity";
import { Ledger } from "./ledger.entity";
import { LedgerEntry } from "./ledger-entry.entity";

@Entity({ name: "ledger_transaction" })
export class LedgerTransaction extends UuidEntity {
  @ManyToOne(() => Ledger, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ledger_id" })
  ledger: Ledger; // Foreign key reference to Ledger

  @Column({ type: "varchar", length: 1000 })
  description: string;

  @Column({ type: "varchar", length: 50, unique: true })
  idempotence_key: string; // Idempotence key for duplicate prevention

  @Column({ type: "jsonb", nullable: true })
  tags: Record<string, unknown>; // Stores metadata (e.g., category, reference ID, etc.)

  @Column({ type: "timestamptz" })
  posted_at: Date; // The timestamp when the transaction was recorded

  @Column("json", { nullable: true })
  params: Object[];

  @OneToMany(() => LedgerEntry, (ledgerEntry) => ledgerEntry.transaction)
  lines: LedgerEntry[];

  toJSON() {
    return {
      ...this,
      lines: this.lines.map((line) => ({
        ...line,
        amount: line.amountInOriginalUnit,
      })),
    };
  }
}
