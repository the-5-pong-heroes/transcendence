import { type Vec3 } from "cannon-es";

export type PaddleSide = "left" | "right";

export type PaddleMove = "up" | "down" | "stop";

export type PaddleState = {
  side: PaddleSide;
  lastMove: PaddleMove;
  pos: Vec3;
  height: number;
  width: number;
  depth: number;
  velocity: number;
};
