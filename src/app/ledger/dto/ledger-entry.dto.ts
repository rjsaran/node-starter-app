import { Type } from "class-transformer";
import {
  IsDate,
  IsIn,
  IsNumber,
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

class LedgerTxnRefDTO {
  @IsUUID()
  id: string;
}

class LedgerAccountRefDTO {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  ikey?: string;
}

export class ListLedgerEntryDTO {
  @IsUUID()
  account_id: string;
}

export class CreateLedgerEntryDTO {
  @IsString()
  @Length(1, 1000)
  description: string;

  @ValidateNested()
  @Type(() => LedgerRefDTO)
  ledger: LedgerRefDTO;

  @IsNumber()
  amount: number;

  @IsString()
  @IsIn(Object.keys(CURRENCY_PRECISION))
  currency: CurrencyCode; // ISO 4217 currency code

  @ValidateNested()
  @Type(() => LedgerAccountRefDTO)
  account: LedgerAccountRefDTO;

  @IsDate()
  @Type(() => Date)
  posted_at: Date; // Timestamp for when the transaction was posted

  @ValidateNested()
  @Type(() => LedgerTxnRefDTO)
  transaction: LedgerTxnRefDTO;
}
