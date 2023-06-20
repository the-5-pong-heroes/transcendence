import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GAME_DEPTH,
  RIGHT_PADDLE_X,
  LEFT_PADDLE_X,
  PADDLE_VELOCITY,
  BALL_ACC_X,
} from "./constants";
import type {
  PaddleSide,
  CollisionSide,
  PaddleMove,
  PongState,
} from "./@types";
import { Ball } from "./ball";
import { Paddle } from "./paddle";
import {
  reachedRightPaddle,
  reachedLeftPaddle,
  reachedRight,
  reachedLeft,
  reachedBottom,
  reachedTop,
  getRandomRotFactor,
} from "./helpers";

export class Pong {
  width: number;
  height: number;
  depth: number;
  ball: Ball;
  paddle: { [Side in PaddleSide]: Paddle<Side> };
  rotFactor: number;
  firstPaddleCollision: boolean;

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
    this.rotFactor = 0.001;
    this.firstPaddleCollision = false;
  }

  initRound(round: number): void {
    this.rotFactor = 0.001;
    this.ball.initRound(round);
    this.paddle.right.move({ y: 0, gameHeight: this.height });
    this.paddle.left.move({ y: 0, gameHeight: this.height });
    this.firstPaddleCollision = false;
  }

  public update(delta: number): void {
    this.ball.update({
      delta,
      rotFactor: this.rotFactor,
      paddleRight: this.paddle.right,
      paddleLeft: this.paddle.left,
    });
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
    /* Missed paddle */
    if (reachedRight(this.ball)) {
      return "right";
    }
    if (reachedLeft(this.ball)) {
      return "left";
    }

    /* Reached paddle */
    if (reachedRightPaddle(this.ball, this.paddle.right)) {
      this.handlePaddleCollision("right");
    }

    if (reachedLeftPaddle(this.ball, this.paddle.left)) {
      this.handlePaddleCollision("left");
    }

    /* Reached wall */
    if (reachedBottom(this.ball)) {
      this.ball.velY = -Math.abs(this.ball.velY);
      this.ball.accX = -Math.abs(this.ball.accY);
      this.rotFactor = getRandomRotFactor();
    }
    if (reachedTop(this.ball)) {
      this.ball.velY = Math.abs(this.ball.velY);
      this.ball.accY = Math.abs(this.ball.accY);
      this.rotFactor = getRandomRotFactor();
    }

    return "none";
  };

  handlePaddleCollision = (collision: CollisionSide): void => {
    if (!this.firstPaddleCollision) {
      this.firstPaddleCollision = true;
      this.ball.velX *= 3;
    }

    if (collision === "right") {
      this.ball.velX = -Math.abs(this.ball.velX);
      this.ball.accX += BALL_ACC_X;
      this.ball.accX = -Math.abs(this.ball.accX);
    }
    if (collision === "left") {
      this.ball.velX = Math.abs(this.ball.velX);
      this.ball.accX += BALL_ACC_X;
      this.ball.accX = Math.abs(this.ball.accX);
    }
    this.rotFactor = getRandomRotFactor();
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
