import React from "react";
import type { Pong } from "shared/pongCore";

// import type { Pong } from "../pongCore";
import type { PlayState, GameMode, PaddleSide, ServerPong } from "../@types";
import { type GameOverlayRef } from "../GameOverlay";

interface ContextParameters {
  height: number;
  width: number;
  overlayRef: React.RefObject<GameOverlayRef> | undefined;
  playRef: React.MutableRefObject<PlayState>;
  gameMode: GameMode | undefined;
  setGameMode: (mode: GameMode) => void;
  localPongRef: React.MutableRefObject<Pong>;
  serverPongRef: React.MutableRefObject<ServerPong | undefined>;
  paddleSideRef: React.MutableRefObject<PaddleSide>;
}

export const GameContext = React.createContext<ContextParameters | undefined>(undefined);
