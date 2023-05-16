import type { LobbyMode, LobbyStatus } from "../Lobby";
import type { GameMode } from "../Game";

export type LobbyState = {
  id: string;
  userLeft: string;
  userRight: string;
  status: LobbyStatus;
  mode: LobbyMode;
  gameMode: GameMode;
};
