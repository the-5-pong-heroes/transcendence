import React from "react";

import "./Game.css";
import { GameOverlay } from "./GameOverlay";
import { Pong2D } from "./Pong2D";
import { Pong3D } from "./Pong3D";
import { PongMenu } from "./PongMenu";
import { GameProvider } from "./context/GameProvider";
import { useGameSize } from "./hooks";

interface GameProps {
  gameRef: React.RefObject<HTMLDivElement>;
}

export const Game: React.FC<GameProps> = ({ gameRef }) => {
  const { height, width } = useGameSize();
  const gameStyle: React.CSSProperties = { width, height };

  return (
    <div ref={gameRef} id="Game" className="game-container">
      <div className="game" style={gameStyle}>
        <GameProvider>
          <PongMenu />
          <GameOverlay />
          <Pong2D />
          <Pong3D />
        </GameProvider>
      </div>
    </div>
  );
};
