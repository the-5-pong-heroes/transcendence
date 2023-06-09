import { IsString, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(8)
  password: string;

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
