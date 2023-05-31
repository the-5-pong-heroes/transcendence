import { Length, IsString } from "class-validator";

export class UpdateUsernameDto {
  @Length(3, 20)
  @IsString()
  name: string;
}
