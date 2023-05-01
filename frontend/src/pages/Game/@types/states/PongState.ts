import type { BallState } from "./BallState";
import type { PaddleState } from "./PaddleState";

export type PongState = {
  ball: BallState;
  paddleRight: PaddleState;
  paddleLeft: PaddleState;
};
