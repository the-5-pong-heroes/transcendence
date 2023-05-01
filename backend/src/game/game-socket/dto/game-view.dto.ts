import { IsString, IsNotEmpty } from "class-validator";

export class GameViewDto {
  @IsString()
  @IsNotEmpty()
  lobbyId: string;

  constructor(id: string) {
    this.lobbyId = id;
  }
}
