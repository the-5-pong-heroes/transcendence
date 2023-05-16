import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class GameInviteResponseDto {
  @IsBoolean()
  response: boolean;

  @IsString()
  @IsNotEmpty()
  senderId: string;

  constructor(response: boolean, id: string) {
    this.response = response;
    this.senderId = id;
  }
}
