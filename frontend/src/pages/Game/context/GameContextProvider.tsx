import React, { useMemo, useRef, useState } from "react";
import { Pong } from "shared/pongCore";

// import { Pong } from "../pongCore";
import type { PlayState, GameMode, PaddleSide, ServerPong } from "../@types";
import { type GameOverlayRef } from "../GameOverlay";
import { useGameSize, usePause } from "../hooks";

import { GameContext } from "./GameContext";

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

interface ProviderParameters {
  children: React.ReactNode;
}

export const GameContextProvider: React.FC<ProviderParameters> = ({ children }) => {
  const overlayRef = useRef<GameOverlayRef>(null);
  const { height, width } = useGameSize();
  const { playRef } = usePause();
  const [gameMode, setGameMode] = useState<GameMode | undefined>();
  const paddleSideRef = useRef<PaddleSide>("right");
  const localPongRef = useRef<Pong>(new Pong());
  const serverPongRef = useRef<ServerPong>();

  const gameContext = useMemo(
    (): ContextParameters => ({
      height,
      width,
      overlayRef,
      playRef,
      gameMode,
      setGameMode,
      paddleSideRef,
      serverPongRef,
      localPongRef,
    }),
    [height, width, overlayRef, playRef, gameMode, setGameMode, localPongRef, paddleSideRef]
  );

  return <GameContext.Provider value={gameContext}>{children}</GameContext.Provider>;
};
