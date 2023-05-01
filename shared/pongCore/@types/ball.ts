import { type Vec3 } from "cannon-es";

export type BallState = {
  radius: number;
  pos: Vec3;
  rot: number;
  velX: number;
  velY: number;
};
