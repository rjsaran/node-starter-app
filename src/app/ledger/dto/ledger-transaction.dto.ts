import { Type } from "class-transformer";
import {
  IsDate,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from "class-validator";
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

class LedgerAccountRefDTO {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  ikey?: string;
}

class LedgerTxnLineDTO {
  @IsNumber()
  amount: number;

  @IsString()
  @IsIn(Object.keys(CURRENCY_PRECISION))
  currency: CurrencyCode; // ISO 4217 currency code

  @ValidateNested()
  @Type(() => LedgerAccountRefDTO)
  account: LedgerAccountRefDTO;
}

export class ListLedgerTransactionDTO {
  @IsUUID()
  ledger_id: string;
}

export class CreateLedgerTransactionDTO {
  @IsString()
  @Length(1, 1000)
  description: string;

  @ValidateNested()
  @Type(() => LedgerRefDTO)
  ledger: LedgerRefDTO;

  @IsString()
  @Length(1, 50)
  idempotence_key: string; // Unique key to prevent duplicate creation

  @IsDate()
  @Type(() => Date)
  posted_at: Date; // Timestamp for when the transaction was posted

  @ValidateNested()
  @Type(() => LedgerTxnLineDTO)
  lines: LedgerTxnLineDTO[];

  @IsObject()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tags: Record<string, any>; // JSON object to store arbitrary tags
}

export class UpdateLedgerTransactionDTO {
  @IsObject()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tags: Record<string, any>; // JSON object to store arbitrary tags
}
