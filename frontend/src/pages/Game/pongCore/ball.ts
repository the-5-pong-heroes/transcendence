import { Vec3 } from "cannon-es";

import { BALL_RADIUS, BALL_VEL_X, BALL_VEL_Y, PADDLE_DEPTH, OFFSET_Z } from "./constants";
import { type BallState } from "./@types";

interface ConstructorParameters {
  x: number;
  y: number;
  gameDepth: number;
}

interface MoveParameters {
  x: number;
  y: number;
}

interface UpdateParameters {
  delta: number;
  rotFactor: number;
}

export class Ball {
  radius: number;
  posX: number;
  posY: number;
  posZ: number;
  velX: number;
  velY: number;
  accX: number;
  accY: number;
  rot: number;

  constructor({ x, y, gameDepth }: ConstructorParameters) {
    this.radius = BALL_RADIUS;
    this.posX = x;
    this.posY = y;
    this.posZ = -gameDepth / 2 + PADDLE_DEPTH + OFFSET_Z;
    this.velX = BALL_VEL_X;
    this.velY = BALL_VEL_Y;
    this.accX = 0;
    this.accY = 0;
    this.rot = 0;
  }

  initRound(round: number): void {
    this.move({ x: 0, y: 0 });
    this.velX = round % 2 === 0 ? BALL_VEL_X : -BALL_VEL_X;
    this.velY = BALL_VEL_Y;
    this.accX = 0;
    this.accY = 0;
    this.rot = 0;
  }

  move({ x, y }: MoveParameters): void {
    this.posX = x;
    this.posY = y;
  }

  update({ delta, rotFactor }: UpdateParameters): void {
    this.posX += this.velX * delta;
    this.posY += this.velY * delta;

    this.velX += this.accX * delta;
    this.velY += this.accY * delta;

    this.rot += 2 * Math.PI * delta * rotFactor;
  }

  getState(): BallState {
    return {
      radius: this.radius,
      pos: new Vec3(this.posX, this.posY, this.posZ),
      rot: this.rot,
    };
  }
}
