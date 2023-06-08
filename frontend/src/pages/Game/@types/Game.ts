import type { Pong } from "@shared/pongCore";

import { type GameOverlayRef } from "../GameOverlay";

import type { ServerPong } from "./ServerPong";
import type { PlayState, LobbyState } from "./states";

export type GameMode = "2D" | "3D";
export type GameResult = "Winner" | "Loser" | "None";
export type PaddleSide = "left" | "right";
export type PaddleMove = "up" | "down" | "stop";

export interface GameContextParameters {
  height: number;
  width: number;
  lobbyRef: React.MutableRefObject<LobbyState | undefined>;
  overlayRef: React.RefObject<GameOverlayRef> | undefined;
  playRef: React.MutableRefObject<PlayState>;
  gameMode: GameMode | undefined;
  setGameMode: (mode: GameMode | undefined) => void;
  localPongRef: React.MutableRefObject<Pong>;
  serverPongRef: React.MutableRefObject<ServerPong | undefined>;
  paddleSideRef: React.MutableRefObject<PaddleSide | undefined>;
  gameList: LobbyState[];
}
