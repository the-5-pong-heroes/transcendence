import { Vec3 } from "cannon-es";

import { BALL_RADIUS, BALL_VEL_X, BALL_VEL_Y, MAX_BALL_VEL_Y, GAME_HEIGHT } from "./constants";
import { type BallState } from "./@types";
import { lerp, clamp } from "./helpers";
import { type Paddle } from "./paddle";
import { reachedRightPaddle, reachedLeftPaddle } from "./helpers";

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
  paddleRight: Paddle<"right">;
  paddleLeft: Paddle<"left">;
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

  collideWithPaddle(paddleRight: Paddle<"right">, paddleLeft: Paddle<"left">): boolean {
    if (reachedRightPaddle(this, paddleRight)) {
      this.posX = paddleRight.posX - this.radius - paddleRight.width / 2;
      const distanceFromCenter = (this.posY - paddleRight.posY) / (paddleRight.height / 2);
      this.velY = distanceFromCenter * MAX_BALL_VEL_Y + paddleRight.velocity;

      return true;
    }
    if (reachedLeftPaddle(this, paddleLeft)) {
      this.posX = paddleLeft.posX + this.radius + paddleLeft.width / 2;
      const distanceFromCenter = (this.posY - paddleLeft.posY) / (paddleLeft.height / 2);
      this.velY = distanceFromCenter * MAX_BALL_VEL_Y + paddleLeft.velocity;

      return true;
    }

    return false;
  }

  update({ delta, rotFactor, paddleRight, paddleLeft }: UpdateParameters): void {
    if (!this.collideWithPaddle(paddleRight, paddleLeft)) {
      this.posX += this.velX * delta;
    }
    this.posY += this.velY * delta;
    this.posY = clamp(-GAME_HEIGHT / 2 + BALL_RADIUS, GAME_HEIGHT / 2 - BALL_RADIUS, this.posY);

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
