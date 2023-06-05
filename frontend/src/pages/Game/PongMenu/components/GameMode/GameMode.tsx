import React from "react";

import "./GameMode.css";
import type { GameMode } from "@Game/@types";

interface GameModeProps {
  setGameMode: (mode: GameMode) => void;
}

export const GameModeButton: React.FC<GameModeProps> = ({ setGameMode }) => {
  return (
    <div className="game-button-wrapper" id="game-mode">
      <button
        // className="game-button"
        className="gameMode-btn from-right"
        onClick={() => {
          setGameMode("2D");
        }}>
        PONG 2D
      </button>
      <button
        className="gameMode-btn from-left"
        onClick={() => {
          setGameMode("3D");
        }}>
        PONG 3D
      </button>
    </div>
  );
};
