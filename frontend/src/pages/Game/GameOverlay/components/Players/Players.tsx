import React from "react";

import "./Players.css";

import { useGameContext } from "@Game/hooks";
import { type GameContextParameters } from "@Game/@types";
import { useTheme } from "@/hooks";

interface Players {
  player1: string;
  player2: string;
}

export const Players: React.FC<Players> = ({ player1, player2 }) => {
  const { gameMode }: GameContextParameters = useGameContext();
  const theme = useTheme();
  const color = gameMode === "2D" || theme === "dark" ? "white" : "black";
  
  return (
    <div className="game-players-container">
      <div className="game-players" style={{ color: color }}>
        <p>{player1}</p>
        <p>{player2}</p>
      </div>
    </div>
  );
};
