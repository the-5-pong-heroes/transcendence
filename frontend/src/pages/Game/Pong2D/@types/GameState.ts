import type { BallState } from "./BallState";
import type { PaddleState } from "./PaddleState";
import type { ScoreState } from "./ScoreState";

export type GameState = {
  ball: BallState;
  paddleRight: PaddleState;
  paddleLeft: PaddleState;
  score: ScoreState;
};
