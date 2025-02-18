import { Entity, Column } from "typeorm";
import { UuidEntity } from "../../../core/base.entity";

@Entity({ name: "ledger" })
export class Ledger extends UuidEntity {
  @Column({ type: "varchar", length: 300 })
  name: string;

  @Column({ type: "varchar", length: 50, unique: true })
  idempotence_key: string;
}
