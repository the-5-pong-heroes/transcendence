import React from "react";

import { Pong } from "../pongCore";
import type { PlayState, GameMode, PaddleSide } from "../@types";
import { type GameOverlayRef } from "../GameOverlay";

interface ContextParameters {
  height: number;
  width: number;
  overlayRef: React.RefObject<GameOverlayRef> | undefined;
  playRef: React.MutableRefObject<PlayState | undefined>;
  gameMode: GameMode | undefined;
  setGameMode: (mode: GameMode) => void;
  pong: Pong;
  paddleSideRef: React.MutableRefObject<PaddleSide>;
}

// export const GameContext = React.createContext<ContextParameters | undefined>(undefined);

export const GameContext = React.createContext<ContextParameters>({
  height: 0,
  width: 0,
  overlayRef: undefined,
  playRef: { current: undefined },
  gameMode: undefined,
  setGameMode: () => {
    return;
  },
  pong: new Pong(),
  paddleSideRef: { current: "right" },
});
