/* eslint max-lines: ["warn", 275] */

import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GAME_DEPTH,
  PADDLE_WIDTH,
  BALL_OFFSET_RATIO,
  BALL_ACC_X,
  PADDLE_VELOCITY,
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
      gameDepth: this.depth,
    });
    this.paddle = {
      right: new Paddle({
        side: "right",
        x: this.width / 2 - PADDLE_WIDTH * 2,
        y: 0,
        gameDepth: this.depth,
      }),
      left: new Paddle({
        side: "left",
        x: -this.width / 2 + PADDLE_WIDTH * 2,
        y: 0,
        gameDepth: this.depth,
      }),
    };
    this.rotFactor = 0.0;
  }

  initRound(round: number): void {
    this.ball.initRound(this.width, this.height, round);
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

  public updatePaddle(delta: number, side: PaddleSide): void {
    if (side === "right") {
      this.paddle.right.update({
        delta,
        gameHeight: this.height,
      });
    } else if (side === "left") {
      this.paddle.left.update({
        delta,
        gameHeight: this.height,
      });
    }
  }

  public updateBall(delta: number): void {
    this.ball.update({ delta, rotFactor: this.rotFactor });
  }
  private getPaddleVelocity(move: PaddleMove) {
    switch (move) {
      case "up":
        return (PADDLE_VELOCITY);
      case "down":
        return(-PADDLE_VELOCITY);
      default:
        return (0);
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
      this.ball.posX + this.ball.radius >= this.paddle.right.posX &&
      this.ball.posY + this.ball.radius * BALL_OFFSET_RATIO >=
        this.paddle.right.posY - this.paddle.right.height / 2 &&
      this.ball.posY - this.ball.radius * BALL_OFFSET_RATIO <=
        this.paddle.right.posY + this.paddle.right.height / 2;

    const reachedRight = this.ball.posX + this.ball.radius >= this.width / 2;

    const reachedLeftPaddle =
      this.ball.posX - this.ball.radius <= this.paddle.left.posX &&
      this.ball.posY + this.ball.radius * BALL_OFFSET_RATIO >=
        this.paddle.left.posY - this.paddle.left.height / 2 &&
      this.ball.posY - this.ball.radius * BALL_OFFSET_RATIO <=
        this.paddle.left.posY + this.paddle.left.height / 2;

    const reachedLeft = this.ball.posX - this.ball.radius <= -this.width / 2;

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
      this.handlePaddleCollision("right");
    }
    if (reachedLeftPaddle) {
      this.handlePaddleCollision("left");
    }

    /* Reached wall */
    if (reachedBottom) {
      this.handleWallCollision("bottom");
    }
    if (reachedTop) {
      this.handleWallCollision("top");
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
      this.ball.accX = -Math.abs(this.ball.accX) + BALL_ACC_X;
    }
    if (collision === "left") {
      paddleCenter = this.paddle.left.posY + this.paddle.left.height / 2;
      dist = (paddleCenter - this.ball.posY) / (this.paddle.left.height / 2);

      this.ball.velX = Math.abs(this.ball.velX);
      this.ball.accX = Math.abs(this.ball.accX) + BALL_ACC_X;
    }
  };

  handleWallCollision = (collision: CollisionSide): void => {
    if (collision === "bottom") {
      this.ball.velY = -Math.abs(this.ball.velY);
      this.ball.accX = -Math.abs(this.ball.accY);
    }
    if (collision === "top") {
      this.ball.velY = Math.abs(this.ball.velY);
      this.ball.accY = Math.abs(this.ball.accY);
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
      width: this.width,
      height: this.height,
      depth: this.depth,
      ball: this.ball.getState(),
      paddleRight: this.paddle.right.getState(),
      paddleLeft: this.paddle.left.getState(),
      rotFactor: this.rotFactor,
    };
  }

  public set(other: Pong): void {
    this.width = other.width;
    this.height = other.height;
    this.depth = other.depth;
    this.ball.set(other.ball);
    this.paddle.right.set(other.paddle.right);
    this.paddle.left.set(other.paddle.left);
    this.rotFactor = other.rotFactor;
  }
}
