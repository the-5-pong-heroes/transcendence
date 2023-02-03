import type { ScoreState } from "./ScoreState";

export interface GameOverlayRef {
  showScore: ({ player1, player2 }: ScoreState) => void;
  resetGame: () => void;
}
