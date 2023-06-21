import { IsString, IsEmail, IsNotEmpty, Length } from "class-validator";

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 50)
  password: string;
}
