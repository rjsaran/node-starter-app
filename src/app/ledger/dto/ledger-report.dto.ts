import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsUUID } from "class-validator";

export class GenerateEODReportDTO {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNotEmpty()
  @IsUUID()
  ledger_id: string;
}
