import { type BallState } from "./Ball";
import { type PaddleState } from "./Paddle";

export type CollisionSide = "left" | "right" | "bottom" | "top" | "none";

export type PongState = {
  ball: BallState;
  paddleRight: PaddleState;
  paddleLeft: PaddleState;
};
