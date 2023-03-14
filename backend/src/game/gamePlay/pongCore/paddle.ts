import {
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_DEPTH,
  OFFSET_Z,
} from "./constants";
import type { PaddleState, PaddleSide, PaddleMove } from "../../@types";
import { Ball } from "./ball";
import { Vec3 } from "cannon-es";

interface ConstructorParameters<Side extends PaddleSide> {
  side: Side;
  x: number;
  y: number;
  gameDepth: number;
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

  constructor({
    side,
    x,
    y,
    gameDepth,
  }: ConstructorParameters<Side>) {
    this.side = side;
    this.lastMove = "stop";
    this.posX = x;
    this.posY = y;
    this.posZ = -gameDepth / 2 + PADDLE_DEPTH + OFFSET_Z;
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.depth = PADDLE_DEPTH;
    this.velocity = 0;
  }

  private clampPosition(gameHeight: number) {
    this.posY = Math.max(
      -gameHeight / 2 + this.height / 2 + 1,
      Math.min(gameHeight / 2 - this.height / 2 - 1, this.posY)
    );
  }

  public move({ y, gameHeight }: MoveParameters) {
    this.posY = y;
    this.clampPosition(gameHeight);
  }

  public update({ delta, gameHeight }: UpdateParameters) {
    this.posY += this.velocity * delta;
    this.clampPosition(gameHeight);
  }

  private moveBot(ball: Ball): void {
    let speed = 18; // adjust this value to control the speed of the interpolation
    let range = 200;
    let currentPos = this.posY;
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
    };
  }
}
