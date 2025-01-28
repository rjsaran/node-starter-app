import { Entity, Column } from "typeorm";
import { BaseEntity } from "../../../core/base.entity";

@Entity({ name: "user" })
export class User extends BaseEntity {
  @Column({ type: "varchar", length: 300, unique: true })
  email: string;

  @Column({ type: "varchar", length: 300 })
  password: string;

  public validatePassword(inputPassword: string): boolean {
    return this.password === inputPassword;
  }
}
