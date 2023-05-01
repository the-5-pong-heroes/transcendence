import { type BallState } from "./ball";
import { type PaddleState } from "./paddle";

export type CollisionSide = "left" | "right" | "bottom" | "top" | "none";

export type PongState = {
    ball: BallState;
    paddleRight: PaddleState;
    paddleLeft: PaddleState;
  };
  