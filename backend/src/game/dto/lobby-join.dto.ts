import { IsString, IsNotEmpty, MaxLength } from "class-validator";
import { LobbyMode, GameMode } from "../@types";

export class LobbyJoinDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4)
  lobbyMode: LobbyMode;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  gameMode: GameMode;

  constructor(lobbyMode: LobbyMode, gameMode: GameMode) {
    this.lobbyMode = lobbyMode;
    this.gameMode = gameMode;
  }
}
