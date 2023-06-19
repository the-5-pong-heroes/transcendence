import { Length, IsString, IsNotEmpty } from "class-validator";

export class UpdateUsernameDto {
  @Length(3, 20)
  @IsString()
  @IsNotEmpty()
  name: string;
}
