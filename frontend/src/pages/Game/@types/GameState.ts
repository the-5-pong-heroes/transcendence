import type { BallState } from "./BallState";
import type { PaddleState } from "./PaddleState";
import type { ScoreState } from "./ScoreState";
import type { PlayState } from "./PlayState";

export type GameState = {
  ball: BallState;
  paddleRight: PaddleState;
  paddleLeft: PaddleState;
  score: ScoreState;
  play: PlayState;
};
