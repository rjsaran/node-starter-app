import { Entity, Column } from "typeorm";
import { UuidEntity } from "../../core/base.entity";

@Entity({ name: "app_clients" })
export class AppClient extends UuidEntity {
  @Column({ type: "varchar", length: 255 })
  secret_hash: string; // Hashed secret for security

  @Column({ type: "boolean", default: true })
  is_active: boolean; // To disable a client if needed
}
