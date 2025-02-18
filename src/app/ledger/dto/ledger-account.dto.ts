import {
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from "class-validator";
import { LedgerAccountType } from "../repository/ledger-account.entity";
import { Type } from "class-transformer";
import { CurrencyCode } from "../../../core/types";
import { CURRENCY_PRECISION } from "../../../core/constants";

class LedgerRefDTO {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  ikey?: string;
}

export class ListLedgerAccountDTO {
  @IsUUID()
  ledger_id: string;
}

export class CreateLedgerAccountDTO {
  @IsString()
  @Length(1, 300)
  name: string;

  @ValidateNested()
  @Type(() => LedgerRefDTO)
  ledger: LedgerRefDTO;

  @IsString()
  @IsIn(Object.keys(CURRENCY_PRECISION))
  currency: CurrencyCode; // ISO 4217 currency code

  @IsEnum(LedgerAccountType)
  type: LedgerAccountType;

  @IsString()
  @Length(1, 50)
  idempotence_key: string; // Unique key to prevent duplicate creation

  @IsString()
  @Length(1, 500)
  path: string; // Hierarchical path for ledger organization
}

export class UpdateLedgerAccountDTO {
  @IsOptional()
  @IsString()
  @Length(1, 300)
  name?: string;
}
