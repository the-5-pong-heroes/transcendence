import type { GameMode } from "./Game";

export type LobbyMode = "solo" | "duo";
export type LobbyStatus = "waiting" | "running";

export type LobbyState = {
  id: string;
  userLeft: string;
  userRight: string;
  status: LobbyStatus;
  mode: LobbyMode;
  gameMode: GameMode;
};
