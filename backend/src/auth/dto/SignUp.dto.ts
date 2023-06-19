import { IsString, IsEmail, IsNotEmpty, Length } from "class-validator";

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 50)
  password: string;
}
