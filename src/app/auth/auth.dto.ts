import { IsString, IsUUID, Length } from "class-validator";

export class GenerateTokenDTO {
  @IsString()
  @IsUUID()
  client_id: string;

  @IsString()
  @Length(1, 255)
  client_secret: string;
}
