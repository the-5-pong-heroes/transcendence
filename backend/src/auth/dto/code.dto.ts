import { IsString, IsNotEmpty } from "class-validator";

export class CodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
