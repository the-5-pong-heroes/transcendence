import React from "react";

import "./Players.css";

interface Players {
  player1: string;
  player2: string;
}

export const Players: React.FC<Players> = ({ player1, player2 }) => {
  return (
    <div className="game-players-container">
      <div className="game-players">
        <p>{player1}</p>
        <p>{player2}</p>
      </div>
    </div>
  );
};
