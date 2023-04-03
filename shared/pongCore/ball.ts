import { Vec3 } from "cannon-es";

import { BALL_RADIUS, BALL_VEL_X, BALL_VEL_Y } from "./constants";
import { type BallState } from "./@types";
import { lerp } from "./helpers";

interface ConstructorParameters {
  x: number;
  y: number;
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

  constructor({ x, y }: ConstructorParameters) {
    this.radius = BALL_RADIUS;
    this.posX = x;
    this.posY = y;
    this.posZ = 0;
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
      velX: this.velX,
      velY: this.velY,
    };
  }

  public set(other: BallState): void {
    // console.log("🏀", this.posX, other.pos.x, this.posY, other.pos.y);
    this.radius = other.radius;
    this.posX = other.pos.x;
    this.posY = other.pos.y;
    this.posZ = other.pos.z;
    this.rot = other.rot;
    this.velX = other.velX;
    this.velY = other.velY;
  }

  public interpolate(other: BallState, factor: number): void {
    this.posX = lerp({ value1: this.posX, value2: other.pos.x, t: factor });
    this.posY = lerp({ value1: this.posY, value2: other.pos.y, t: factor });
    this.posZ = lerp({ value1: this.posZ, value2: other.pos.z, t: factor });
    this.rot = lerp({ value1: this.rot, value2: other.rot, t: factor });
    this.velX = lerp({ value1: this.velX, value2: other.velX, t: factor });
    this.velY = lerp({ value1: this.velY, value2: other.velY, t: factor });
  }
}
