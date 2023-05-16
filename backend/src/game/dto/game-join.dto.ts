import { IsString, IsNotEmpty } from "class-validator";

export class GameJoinDto {
  @IsString()
  @IsNotEmpty()
  lobbyId: string;

  constructor(id: string) {
    this.lobbyId = id;
  }
}
