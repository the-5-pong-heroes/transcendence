import { IsNotEmpty, IsString } from "class-validator";

export class AuthCallbackDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
