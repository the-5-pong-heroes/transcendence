import type { ScoreState } from "../@types";

export const computeScoreLabel = ({ player1, player2 }: ScoreState): string => {
  return `${player1}   ${player2}`;
};
