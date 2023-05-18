import { Length, IsAlphanumeric } from "class-validator";

export class UpdateUsernameDto {
  @Length(3, 20)
  @IsAlphanumeric()
  // @IsNotEmpty()
  name: string;
}

//unique
//longueur
