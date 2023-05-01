import type { ScoreState } from "../@types/states";

export const computeScoreLabel = ({ player1, player2 }: ScoreState): string => {
  return `${player1}    ${player2}`;
};
