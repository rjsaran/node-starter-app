import { IsOptional, IsString, Length } from "class-validator";

export class CreateLedgerDTO {
  @IsString()
  @Length(1, 300)
  name: string;

  @IsString()
  @Length(1, 50)
  idempotence_key: string;
}

export class UpdateLedgerDTO {
  @IsOptional()
  @IsString()
  @Length(1, 300)
  name?: string;
}
