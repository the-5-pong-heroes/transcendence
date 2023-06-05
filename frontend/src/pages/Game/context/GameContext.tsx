import React from "react";

import type { GameContextParameters } from "../@types";

<<<<<<< HEAD
export const GameContext = React.createContext<GameContextParameters | undefined>(undefined);
=======
interface ContextParameters {
  height: number;
  width: number;
  overlayRef: React.RefObject<GameOverlayRef> | undefined;
  playRef: React.MutableRefObject<PlayState>;
  gameMode: GameMode | undefined;
  setGameMode: (mode: GameMode | undefined) => void;
  localPongRef: React.MutableRefObject<Pong>;
  serverPongRef: React.MutableRefObject<ServerPong | undefined>;
  paddleSideRef: React.MutableRefObject<PaddleSide>;
}

export const GameContext = React.createContext<ContextParameters | undefined>(undefined);
>>>>>>> master
