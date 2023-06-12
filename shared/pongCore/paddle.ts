import { Vec3 } from "cannon-es";

import { PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_DEPTH } from "./constants";
import type { PaddleState, PaddleSide, PaddleMove } from "./@types";
import type { Ball } from "./ball";
import { lerp } from "./helpers";

interface ConstructorParameters<Side extends PaddleSide> {
  side: Side;
  x: number;
  y: number;
}

interface MoveParameters {
  y: number;
  gameHeight: number;
}

interface UpdateParameters {
  delta: number;
  gameHeight: number;
}

export class Paddle<Side extends PaddleSide> {
  side: Side;
  lastMove: PaddleMove;
  posX: number;
  posY: number;
  posZ: number;
  height: number;
  width: number;
  depth: number;
  velocity: number;

  constructor({ side, x, y }: ConstructorParameters<Side>) {
    this.side = side;
    this.lastMove = "stop";
    this.posX = x;
    this.posY = y;
    this.posZ = 0;
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.depth = PADDLE_DEPTH;
    this.velocity = 0;
  }

  private clampPosition(gameHeight: number): void {
    this.posY = Math.max(
      -gameHeight / 2 + this.height / 2 + 1,
      Math.min(gameHeight / 2 - this.height / 2 - 1, this.posY),
    );
  }

  public move({ y, gameHeight }: MoveParameters): void {
    this.posY = y;
    this.clampPosition(gameHeight);
  }

  public update({ delta, gameHeight }: UpdateParameters): void {
    this.posY += this.velocity * delta;
    this.clampPosition(gameHeight);
  }

  private moveBot(ball: Ball): void {
    const speed = 18; // adjust this value to control the speed of the interpolation
    const range = 200;
    const currentPos = this.posY;
    let previousDirection = 0;
    let currentDirection = ball.velY;

    if (currentDirection * previousDirection < 0) {
      previousDirection = currentDirection;
      currentDirection = currentDirection + (Math.random() * 2 - 1) * range;
    }

    this.posY = currentPos + currentDirection * speed;
  }

  getState(): PaddleState {
    return {
      side: this.side,
      lastMove: this.lastMove,
      pos: new Vec3(this.posX, this.posY, this.posZ),
      height: this.height,
      width: this.width,
      depth: this.depth,
      velocity: this.velocity,
    };
  }

  public set(other: PaddleState): void {
    this.lastMove = other.lastMove;
    this.posX = other.pos.x;
    // this.posY = other.pos.y;
    this.posZ = other.pos.z;
    this.height = other.height;
    this.width = other.width;
    this.depth = other.depth;
    this.velocity = other.velocity;
  }

  public interpolate(other: PaddleState, factor: number): void {
    this.posX = lerp({ value1: this.posX, value2: other.pos.x, t: factor });
    this.posY = lerp({ value1: this.posY, value2: other.pos.y, t: factor });
    this.posZ = lerp({ value1: this.posZ, value2: other.pos.z, t: factor });
    this.velocity = lerp({
      value1: this.velocity,
      value2: other.velocity,
      t: factor,
    });
  }
}
