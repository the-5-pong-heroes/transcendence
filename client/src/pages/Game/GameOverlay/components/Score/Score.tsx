import React from "react";

import type { ScoreState } from "../../@types";

import "./Score.css";

interface ScoreProps {
  score: ScoreState;
}

export const Score: React.FC<ScoreProps> = ({ score }) => {
  return (
    <div className="score">
      {score.player1} {score.player2}
    </div>
  );
};
