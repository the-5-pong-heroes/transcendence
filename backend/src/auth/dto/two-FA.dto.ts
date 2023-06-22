import { IsString, IsNotEmpty } from "class-validator";

export class TwoFADto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
