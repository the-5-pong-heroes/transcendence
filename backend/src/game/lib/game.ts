import { EventEmitter } from "events";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GAME_DEPTH,
  PADDLE_WIDTH_RATIO,
  BALL_OFFSET_RATIO,
  MAX_BOUNCE_ANGLE,
  BALL_ACC_X,
  SCORE_MAX,
  MIN_ROT_FACTOR,
  MAX_ROT_FACTOR,
} from "../constants";
import { GameStateDto } from "../dto/game.dto";

import { PaddleSide, CollisionSide } from "./@types";
import { Ball } from "./ball";
import { Paddle } from "./paddle";
import { Play } from "./play";
import { Score } from "./score";

type User<Side extends PaddleSide> = {
  id: string;
  name: string;
  side: Side;
  paddle: Paddle<Side>;
  isBot?: boolean;
};

export class Game extends EventEmitter {
  width: number;
  height: number;
  depth: number;
  score: Score;
  ball: Ball;
  user: { [Side in PaddleSide]: User<Side> };
  play: Play;
  rotFactor: number;

  constructor({ userId }: { userId: string }) {
    super();
    this.width = GAME_WIDTH;
    this.height = GAME_HEIGHT;
    this.depth = GAME_DEPTH;
    this.score = new Score();
    this.ball = new Ball({
      x: 0,
      y: 0,
      gameWidth: this.width,
      gameHeight: this.height,
      gameDepth: this.depth,
      score: this.score,
    });
    this.user = {
      right: {
        id: userId,
        name: "Player 1",
        side: "right",
        paddle: new Paddle({
          side: "right",
          x: this.width / 2 - this.width * PADDLE_WIDTH_RATIO * 2,
          y: 0,
          gameWidth: this.width,
          gameHeight: this.height,
          gameDepth: this.depth,
        }),
      },
      left: {
        id: "bot",
        name: "Player 2",
        side: "left",
        paddle: new Paddle({
          side: "left",
          x: -this.width / 2 + this.width * PADDLE_WIDTH_RATIO * 2,
          y: 0,
          gameWidth: this.width,
          gameHeight: this.height,
          gameDepth: this.depth,
        }),
        isBot: true,
      },
    };
    this.play = new Play();
    this.rotFactor = 0.0;
  }

  initRound(score?: Score): void {
    this.score.set(score);
    this.ball.initRound(this.width, this.height, score);
    this.user.right.paddle.move({ y: 0, gameHeight: this.height });
    this.user.left.paddle.move({ y: 0, gameHeight: this.height });
  }

  start() {
    this.play.start();
    this.emit("updateScore", this.getDto());
  }

  pause() {
    this.play.pause();
  }

  imperativePaddleMove(): number {
    let speed = 1; // adjust this value to control the speed of the interpolation
    let range = 50;
    let currentPos = this.user.left.paddle.posY;
    let targetPos = this.ball.posY;
    let previousDirection = 0;
    let currentDirection = this.ball.velY;

    if (currentDirection * previousDirection < 0) {
      previousDirection = currentDirection;
      currentDirection = currentDirection + (Math.random() * 2 - 1) * range;
    }

    return currentPos + currentDirection * speed;
  }

  update(delta: number): void {
    this.ball.update({ delta, rotFactor: this.rotFactor });
    this.user.right.paddle.update({ delta, gameHeight: this.height });
    this.user.left.paddle.move({ y: this.ball.posY, gameHeight: this.height });
    this.handleCollisions();
    this.emit("updateGame", this.getDto());
  }

  updatePaddleVel(newVelocity: number): void {
    this.user.right.paddle.velocity = newVelocity * this.height;
  }

  handleCollisions = (): void => {
    const reachedRightPaddle =
      this.ball.posX + this.ball.radius >= this.user.right.paddle.posX &&
      this.ball.posY + this.ball.radius * BALL_OFFSET_RATIO >=
        this.user.right.paddle.posY - this.user.right.paddle.height / 2 &&
      this.ball.posY - this.ball.radius * BALL_OFFSET_RATIO <=
        this.user.right.paddle.posY + this.user.right.paddle.height / 2;

    const reachedRight = this.ball.posX + this.ball.radius >= this.width / 2;

    const reachedLeftPaddle =
      this.ball.posX - this.ball.radius <= this.user.left.paddle.posX &&
      this.ball.posY + this.ball.radius * BALL_OFFSET_RATIO >=
        this.user.left.paddle.posY - this.user.left.paddle.height / 2 &&
      this.ball.posY - this.ball.radius * BALL_OFFSET_RATIO <=
        this.user.left.paddle.posY + this.user.left.paddle.height / 2;

    const reachedLeft = this.ball.posX - this.ball.radius <= -this.width / 2;

    const reachedBottom = this.ball.posY + this.ball.radius >= this.height / 2;

    const reachedTop = this.ball.posY - this.ball.radius <= -this.height / 2;

    /* Reached paddle */
    if (reachedRightPaddle) {
      this.handlePaddleCollision("right");
    }
    if (reachedLeftPaddle) {
      this.handlePaddleCollision("left");
    }

    /* Missed paddle */
    if (reachedRight) {
      return this.handleMissedCollision("right");
    }
    if (reachedLeft) {
      return this.handleMissedCollision("left");
    }

    /* Reached wall */
    if (reachedBottom) {
      this.handleWallCollision("bottom");
    }
    if (reachedTop) {
      this.handleWallCollision("top");
    }
  };

  getRandomRotFactor = (): number => {
    return Math.random() * (MAX_ROT_FACTOR - MIN_ROT_FACTOR) + MIN_ROT_FACTOR;
  };

  handlePaddleCollision = (collision: CollisionSide): void => {
    let paddleCenter: number;
    let dist: number;

    if (collision === "right") {
      paddleCenter =
        this.user.right.paddle.posY + this.user.right.paddle.height / 2;
      dist =
        (paddleCenter - this.ball.posY) / (this.user.right.paddle.height / 2);
      //   this.ball.velX += Math.cos(dist * MAX_BOUNCE_ANGLE);
      //   this.ball.velY += -Math.sin(dist * MAX_BOUNCE_ANGLE);

      this.ball.velX = -Math.abs(this.ball.velX);
      this.ball.accX = -Math.abs(this.ball.accX) + BALL_ACC_X;
    }
    if (collision === "left") {
      paddleCenter =
        this.user.left.paddle.posY + this.user.left.paddle.height / 2;
      dist =
        (paddleCenter - this.ball.posY) / (this.user.left.paddle.height / 2);
      //   this.ball.velX += Math.cos(dist * MAX_BOUNCE_ANGLE);
      //   this.ball.velY += -Math.sin(dist * MAX_BOUNCE_ANGLE);

      this.ball.velX = Math.abs(this.ball.velX);
      this.ball.accX = Math.abs(this.ball.accX) + BALL_ACC_X;
    }
    // this.rotFactor = this.getRandomRotFactor();
  };

  handleMissedCollision = (collision: CollisionSide): void => {
    if (collision === "right") {
      this.score.player1 += 1;
    }
    if (collision === "left") {
      this.score.player2 += 1;
    }
    this.score.round++;
    this.emit("updateScore", this.getDto());
    if (this.score.player1 < SCORE_MAX && this.score.player2 < SCORE_MAX) {
      return this.initRound(this.score);
    }
    this.play.stop();
    this.initRound();
    this.emit("resetGame", this.getDto());
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
    // this.rotFactor = this.getRandomRotFactor();
  };

  getDto = (): GameStateDto => {
    return {
      ball: this.ball.getDto(),
      paddleRight: this.user.right.paddle.getDto(),
      paddleLeft: this.user.left.paddle.getDto(),
      score: this.score.getDto(),
      play: this.play.getDto(),
    };
  };
}
