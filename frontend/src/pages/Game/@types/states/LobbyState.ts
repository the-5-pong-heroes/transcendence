import type { LobbyMode, LobbyStatus } from "../Lobby";

import type { GameState } from "./GameState";

export type LobbyState = {
  lobbyId: string;
  mode: LobbyMode;
  status: LobbyStatus;
  game: GameState;
};
