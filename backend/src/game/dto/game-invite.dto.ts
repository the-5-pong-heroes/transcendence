import { IsString, IsNotEmpty } from "class-validator";

export class GameInviteDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
