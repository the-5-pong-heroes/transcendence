import React from "react";
import "./GameMode.css";

import type { GameMode } from "../../../@types";

interface GameModeProps {
  setGameMode: (mode: GameMode) => void;
}

export const GameModeButton: React.FC<GameModeProps> = ({ setGameMode }) => {
  return (
    <div className="button-wrapper">
      <button
        className="button"
        onClick={() => {
          setGameMode("2D");
        }}>
        PONG 2D
      </button>
      <button
        className="button"
        onClick={() => {
          setGameMode("3D");
        }}>
        PONG 3D
      </button>
    </div>
  );
};
