import React, { useMemo, useRef } from "react";
import { Outlet } from "react-router-dom";

import "./Game.css";
import { useGameSize, usePause } from "./hooks";
import { type GameOverlayRef } from "./GameOverlay";
import type { PlayState } from "./Pong2D/@types";

export const getInitialPlayState = (): PlayState => ({
  started: false,
  paused: true,
});

export const Game: React.FC = () => {
  const overlayRef = useRef<GameOverlayRef>(null);
  const { height, width } = useGameSize();
  const { playRef } = usePause();

  const gameStyle: React.CSSProperties = { width, height };

  const context = useMemo(() => ({ height, width, overlayRef, playRef }), [height, width, playRef]);

  return (
    <div className="game-container">
      <div className="game" style={gameStyle}>
        <Outlet context={context} />
      </div>
    </div>
  );
};
