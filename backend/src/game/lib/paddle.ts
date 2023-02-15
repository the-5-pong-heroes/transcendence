import {
  PADDLE_HEIGHT_RATIO,
  PADDLE_WIDTH_RATIO,
  PADDLE_VELOCITY_RATIO,
  PADDLE_DEPTH_RATIO,
} from "../constants";
import { PaddleStateDto } from "../dto/game.dto";
import { PaddleSide } from "./@types";

const OFFSET_Z = 2;

interface ConstructorParameters<Side extends PaddleSide> {
  side: Side;
  x: number;
  y: number;
  gameHeight: number;
  gameWidth: number;
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
    gameWidth,
    gameHeight,
    gameDepth,
  }: ConstructorParameters<Side>) {
    this.side = side;
    this.posX = x;
    this.posY = y;
    this.posZ = -gameDepth / 2 + gameDepth * PADDLE_DEPTH_RATIO + OFFSET_Z;
    this.width = gameWidth * PADDLE_WIDTH_RATIO;
    this.height = gameHeight * PADDLE_HEIGHT_RATIO;
    this.depth = gameDepth * PADDLE_DEPTH_RATIO;
    this.velocity = 0;
  }

  move({ y, gameHeight }: MoveParameters) {
    this.posY = y;
    this.posY = Math.max(
      -gameHeight / 2 + this.height / 2 + 1,
      Math.min(gameHeight / 2 - this.height / 2 - 1, this.posY)
    );
  }

  update({ delta, gameHeight }: UpdateParameters) {
    this.posY += this.velocity * delta;
    this.posY = Math.max(
      -gameHeight / 2 + this.height / 2 + 1,
      Math.min(gameHeight / 2 - this.height / 2 - 1, this.posY)
    );
  }

  getDto(): PaddleStateDto {
    return {
      posX: this.posX,
      posY: this.posY,
      posZ: this.posZ,
      height: this.height,
      width: this.width,
      depth: this.depth,
    };
  }
}
