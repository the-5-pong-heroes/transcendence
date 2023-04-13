import { IsString, IsNotEmpty } from "class-validator";
import { LobbyMode, GameMode } from "../@types";

export class LobbyJoinDto {
  @IsString()
  @IsNotEmpty()
  lobbyMode: LobbyMode;
  @IsString()
  @IsNotEmpty()
  gameMode: GameMode;

  constructor(lobbyMode: LobbyMode, gameMode: GameMode) {
    this.lobbyMode = lobbyMode;
    this.gameMode = gameMode;
  }
}
