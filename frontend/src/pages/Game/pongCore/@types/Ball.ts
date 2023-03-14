import { type Vec3 } from "cannon-es";

export type CollisionSide = "left" | "right" | "bottom" | "top" | "none";

export type BallState = {
  radius: number;
  pos: Vec3;
  rot: number;
};
