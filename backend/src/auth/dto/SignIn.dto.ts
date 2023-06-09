import { IsString, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(8)
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
