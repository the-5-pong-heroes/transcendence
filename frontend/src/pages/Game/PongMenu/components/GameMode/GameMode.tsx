import React from "react";

import "./GameMode.css";
import type { GameMode } from "@Game/@types";

interface GameModeProps {
  setGameMode: (mode: GameMode) => void;
}

export const GameModeButton: React.FC<GameModeProps> = ({ setGameMode }) => {
  return (
<<<<<<< HEAD
    <div className="game-button-wrapper" id="game-mode">
      <button
        // className="game-button"
        className="gameMode-btn from-right"
=======
    <div className="game-button-wrapper">
      <button
        className="game-button"
>>>>>>> master
        onClick={() => {
          setGameMode("2D");
        }}>
        PONG 2D
      </button>
      <button
<<<<<<< HEAD
        className="gameMode-btn from-left"
=======
        className="game-button"
>>>>>>> master
        onClick={() => {
          setGameMode("3D");
        }}>
        PONG 3D
      </button>
    </div>
  );
};
