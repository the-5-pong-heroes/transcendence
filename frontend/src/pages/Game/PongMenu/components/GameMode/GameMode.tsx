import React from "react";

import type { GameMode } from "../../../@types";

interface GameModeProps {
  setGameMode: (mode: GameMode) => void;
}

export const GameModeButton: React.FC<GameModeProps> = ({ setGameMode }) => {
  return (
    <div className="game-button-wrapper">
      <button
        className="game-button"
        onClick={() => {
          setGameMode("2D");
        }}>
        PONG 2D
      </button>
      <button
        className="game-button"
        onClick={() => {
          setGameMode("3D");
        }}>
        PONG 3D
      </button>
    </div>
  );
};
