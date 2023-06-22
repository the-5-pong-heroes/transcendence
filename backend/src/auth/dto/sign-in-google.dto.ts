import { IsString, IsEmail, IsNotEmpty } from "class-validator";
import { UserGoogleInfos } from "../interface";

export class SignInGoogleDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;

  constructor(user: UserGoogleInfos) {
    this.email = user.email;
    this.name = user.name;
    this.accessToken = user.accessToken;
  }
}
