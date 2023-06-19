import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class GameInviteResponseDto {
  @IsBoolean()
  @IsNotEmpty()
  response: boolean;

  @IsString()
  @IsNotEmpty()
  senderId: string;
}
