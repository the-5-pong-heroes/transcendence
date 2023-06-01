import React from "react";

import "./Players.css";

import { useGameContext } from "@Game/hooks";
import { type GameContextParameters } from "@Game/@types";

interface Players {
  player1: string;
  player2: string;
}

export const Players: React.FC<Players> = ({ player1, player2 }) => {
  const { gameMode }: GameContextParameters = useGameContext();
  const color = gameMode === "2D" ? "white" : "black";

  return (
    <div className="game-players-container">
      <div className="game-players" style={{ color: color }}>
        <p>{player1}</p>
        <p>{player2}</p>
      </div>
    </div>
  );
};
