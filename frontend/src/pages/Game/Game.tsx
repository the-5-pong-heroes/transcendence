import React from "react";

import "./Game.css";
import { GameOverlay } from "./GameOverlay";
import { Pong2D } from "./Pong2D";
import { Pong3D } from "./Pong3D";
import { PongMenu } from "./PongMenu";
import { GameProvider } from "./context/GameProvider";
import { useGameSize } from "./hooks";

export const Game: React.FC = () => {
  const { height, width } = useGameSize();
  const gameStyle: React.CSSProperties = { width, height };

  return (
    <GameProvider>
      <div className="game-container">
        <div className="game" style={gameStyle}>
          <PongMenu />
          <GameOverlay />
          <Pong2D />
          <Pong3D />
        </div>
      </div>
    </GameProvider>
  );
};
