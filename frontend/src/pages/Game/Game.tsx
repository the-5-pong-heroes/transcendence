import React, { useContext } from "react";

import "./Game.css";
import { GameOverlay } from "./GameOverlay";
import { Pong2D } from "./Pong2D";
import { Pong3D } from "./Pong3D";
import { PongMenu } from "./PongMenu";
import { GameContextProvider } from "./context/GameContextProvider";
import { GameContext } from "./context/GameContext";
import { useGameSize } from "./hooks";

export const Game: React.FC = () => {
  const { overlayRef } = useContext(GameContext);
  const { height, width } = useGameSize();
  const gameStyle: React.CSSProperties = { width, height };

  return (
    <GameContextProvider>
      <div className="game-container">
        <div className="game" style={gameStyle}>
          <PongMenu />
          <GameOverlay ref={overlayRef} />
          <Pong2D />
          <Pong3D />
        </div>
      </div>
    </GameContextProvider>
  );
};
