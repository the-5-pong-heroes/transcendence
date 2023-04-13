/* eslint max-lines: ["warn", 275] */

import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GAME_DEPTH,
  RIGHT_PADDLE_X,
  LEFT_PADDLE_X,
  BALL_OFFSET_RATIO,
  PADDLE_VELOCITY,
  PADDLE_WIDTH,
} from "./constants";
import type { PaddleSide, CollisionSide, PaddleMove, PongState } from "./@types";
import { Ball } from "./ball";
import { Paddle } from "./paddle";

export class Pong {
  width: number;
  height: number;
  depth: number;
  ball: Ball;
  paddle: { [Side in PaddleSide]: Paddle<Side> };
  rotFactor: number;

  constructor() {
    this.width = GAME_WIDTH;
    this.height = GAME_HEIGHT;
    this.depth = GAME_DEPTH;
    this.ball = new Ball({
      x: 0,
      y: 0,
    });
    this.paddle = {
      right: new Paddle({
        side: "right",
        x: RIGHT_PADDLE_X,
        y: 0,
      }),
      left: new Paddle({
        side: "left",
        x: LEFT_PADDLE_X,
        y: 0,
      }),
    };
    this.rotFactor = 0.0;
  }

  initRound(round: number): void {
    this.ball.initRound(round);
    this.paddle.right.move({ y: 0, gameHeight: this.height });
    this.paddle.left.move({ y: 0, gameHeight: this.height });
  }

  public update(delta: number): void {
    this.ball.update({ delta, rotFactor: this.rotFactor });
    this.paddle.right.update({
      delta,
      gameHeight: this.height,
    });
    this.paddle.left.update({
      delta,
      gameHeight: this.height,
    });
  }

  private getPaddleVelocity(move: PaddleMove): number {
    switch (move) {
      case "up":
        return PADDLE_VELOCITY;
      case "down":
        return -PADDLE_VELOCITY;
      default:
        return 0;
    }
  }

  public updatePaddleVelocity(side: PaddleSide, move: PaddleMove): void {
    const newVelocity = this.getPaddleVelocity(move);

    if (side === "right") {
      this.paddle.right.velocity = newVelocity;
      this.paddle.right.lastMove = move;
    } else if (side === "left") {
      this.paddle.left.velocity = newVelocity;
      this.paddle.left.lastMove = move;
    }
  }

  detectCollisions = (): CollisionSide => {
    const reachedRightPaddle =
      this.ball.posX + this.ball.radius >= this.paddle.right.posX - PADDLE_WIDTH / 2 &&
      this.ball.posY + this.ball.radius * BALL_OFFSET_RATIO >= this.paddle.right.posY - this.paddle.right.height / 2 &&
      this.ball.posY - this.ball.radius * BALL_OFFSET_RATIO <= this.paddle.right.posY + this.paddle.right.height / 2;

    const reachedRight = this.ball.posX + this.ball.radius >= this.width / 2 + 50;

    const reachedLeftPaddle =
      this.ball.posX - this.ball.radius <= this.paddle.left.posX + PADDLE_WIDTH / 2 &&
      this.ball.posY + this.ball.radius * BALL_OFFSET_RATIO >= this.paddle.left.posY - this.paddle.left.height / 2 &&
      this.ball.posY - this.ball.radius * BALL_OFFSET_RATIO <= this.paddle.left.posY + this.paddle.left.height / 2;

    const reachedLeft = this.ball.posX - this.ball.radius <= -this.width / 2 - 50;

    const reachedBottom = this.ball.posY + this.ball.radius >= this.height / 2;

    const reachedTop = this.ball.posY - this.ball.radius <= -this.height / 2;

    /* Missed paddle */
    if (reachedRight) {
      return "right";
    }
    if (reachedLeft) {
      return "left";
    }

    /* Reached paddle */
    if (reachedRightPaddle) {
      console.log(this.ball.posX + this.ball.radius, this.paddle.right.posX - PADDLE_WIDTH / 2);
      this.handlePaddleCollision("right");
    }
    if (reachedLeftPaddle) {
      this.handlePaddleCollision("left");
    }

    /* Reached wall */
    if (reachedBottom) {
      this.ball.velY = -Math.abs(this.ball.velY);
      this.ball.accX = -Math.abs(this.ball.accY);
    }
    if (reachedTop) {
      this.ball.velY = Math.abs(this.ball.velY);
      this.ball.accY = Math.abs(this.ball.accY);
    }

    return "none";
  };

  handlePaddleCollision = (collision: CollisionSide): void => {
    let paddleCenter: number;
    let dist: number;

    if (collision === "right") {
      paddleCenter = this.paddle.right.posY + this.paddle.right.height / 2;
      dist = (paddleCenter - this.ball.posY) / (this.paddle.right.height / 2);

      this.ball.velX = -Math.abs(this.ball.velX);
      this.ball.accX = -Math.abs(this.ball.accX);
    }
    if (collision === "left") {
      paddleCenter = this.paddle.left.posY + this.paddle.left.height / 2;
      dist = (paddleCenter - this.ball.posY) / (this.paddle.left.height / 2);

      this.ball.velX = Math.abs(this.ball.velX);
      this.ball.accX = Math.abs(this.ball.accX);
    }
  };

  public paddleLastMove(paddleSide: PaddleSide): PaddleMove {
    if (paddleSide === "right") {
      return this.paddle.right.lastMove;
    }

    return this.paddle.left.lastMove;
  }

  public getState(): PongState {
    return {
      ball: this.ball.getState(),
      paddleRight: this.paddle.right.getState(),
      paddleLeft: this.paddle.left.getState(),
    };
  }

  public set(other: PongState): void {
    this.ball.set(other.ball);
    this.paddle.right.set(other.paddleRight);
    this.paddle.left.set(other.paddleLeft);
  }

  public interpolate(other: PongState, factor: number): void {
    this.ball.set(other.ball);
    this.paddle.right.interpolate(other.paddleRight, factor);
    this.paddle.left.interpolate(other.paddleLeft, factor);
  }
}
