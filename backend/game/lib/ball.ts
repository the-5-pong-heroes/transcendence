import {
  BALL_RADIUS_RATIO,
  INITIAL_BALL_VEL_X_RATIO,
  INITIAL_BALL_VEL_Y_RATIO,
  PADDLE_DEPTH_RATIO,
} from "../constants";
import { Score } from "./score";
import { BallStateDto } from "../dto/game.dto";

const OFFSET_Z = 2;

interface ballParameters {
  x: number;
  y: number;
  gameHeight: number;
  gameWidth: number;
  gameDepth: number;
  score: Score;
}

interface moveParameters {
  x: number;
  y: number;
}

interface updateParameters {
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

  constructor({
    x,
    y,
    gameWidth,
    gameHeight,
    gameDepth,
    score,
  }: ballParameters) {
    this.radius = gameWidth * BALL_RADIUS_RATIO;
    this.posX = x;
    this.posY = y;
    this.posZ = -gameDepth / 2 + gameDepth * PADDLE_DEPTH_RATIO + OFFSET_Z;
    this.initRound(gameWidth, gameHeight);
  }

  initRound(gameWidth: number, gameHeight: number, score?: Score) {
    this.move({ x: 0, y: 0 });
    this.velX = score?.round
      ? score.round % 2 === 0
        ? INITIAL_BALL_VEL_X_RATIO * gameWidth
        : -INITIAL_BALL_VEL_X_RATIO * gameWidth
      : INITIAL_BALL_VEL_X_RATIO * gameWidth;
    this.velY = INITIAL_BALL_VEL_Y_RATIO * gameHeight;
    this.accX = 0;
    this.accY = 0;
    this.rot = 0;
  }

  move({ x, y }: moveParameters) {
    this.posX = x;
    this.posY = y;
  }

  update({ delta, rotFactor }: updateParameters) {
    this.posX += this.velX * delta;
    this.posY += this.velY * delta;
    // this.posY += this.velY * delta + 0.5 * 9.8 * delta * delta;

    this.velX += this.accX * delta;
    this.velY += this.accY * delta;
    // this.velY += 9.8 * delta;

    this.rot += 2 * Math.PI * delta * rotFactor;
  }

  getDto(): BallStateDto {
    return {
      radius: this.radius,
      posX: this.posX,
      posY: this.posY,
      posZ: this.posZ,
      rot: this.rot,
    };
  }
}
