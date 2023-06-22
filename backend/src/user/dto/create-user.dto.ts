import { IsString, IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly profilePicture?: string;

  constructor(
    readonly userName: string,
    readonly userEmail: string,
    readonly userPassword: string,
    readonly userPicture?: string,
  ) {
    this.name = userName;
    this.email = userEmail;
    this.password = userPassword;
    this.profilePicture = userPicture;
  }
}
