import { IsString, IsNotEmpty } from "class-validator";
import { LobbyMode, GameMode } from "../@types";

export class LobbyJoinDto {
  @IsString()
  @IsNotEmpty()
  lobbyMode: LobbyMode = "solo";
  @IsString()
  @IsNotEmpty()
  gameMode: GameMode = "2D";
}
