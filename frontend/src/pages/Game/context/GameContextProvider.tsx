import React, { useMemo, useRef, useState } from "react";

import { Pong } from "../pongCore";
import type { PlayState, GameMode, PaddleSide } from "../@types";
import { type GameOverlayRef } from "../GameOverlay";
import { useGameSize, usePause } from "../hooks";

import { GameContext } from "./GameContext";

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

interface ProviderParameters {
  children: React.ReactNode;
}

export const GameContextProvider: React.FC<ProviderParameters> = ({ children }) => {
  const overlayRef = useRef<GameOverlayRef>(null);
  const { height, width } = useGameSize();
  const { playRef } = usePause();
  const [gameMode, setGameMode] = useState<GameMode | undefined>();
  const paddleSideRef = useRef<PaddleSide>("right");
  const pong = useMemo((): Pong => new Pong(), []);

  const gameContext = useMemo(
    (): ContextParameters => ({
      height,
      width,
      overlayRef,
      playRef,
      gameMode,
      setGameMode,
      paddleSideRef,
      pong,
    }),
    [height, width, overlayRef, playRef, gameMode, setGameMode, pong, paddleSideRef]
  );

  return <GameContext.Provider value={gameContext}>{children}</GameContext.Provider>;
};
