import { IsString, IsNotEmpty, IsIn } from "class-validator";
import { LobbyMode, GameMode } from "../@types";

const lobbyModes = ["solo", "duo"] as const;
const gameModes = ["2D", "3D"] as const;

export class LobbyJoinDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(lobbyModes)
  lobbyMode: LobbyMode;

  @IsString()
  @IsNotEmpty()
  @IsIn(gameModes)
  gameMode: GameMode;
}
