import { BallState } from "./BallState";
import { PaddleState } from "./PaddleState";
import { ScoreState } from "./ScoreState";
import { PlayState } from "./PlayState";

export type GameState = {
  ball: BallState;
  paddleRight: PaddleState;
  paddleLeft: PaddleState;
  score: ScoreState;
  play: PlayState;
};
