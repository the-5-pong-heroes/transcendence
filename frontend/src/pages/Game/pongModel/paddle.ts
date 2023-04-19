import { Box, Body, type Material, Vec3 } from "cannon-es";

import type { PaddleSide, PaddleMove, PaddleState } from "./@types";
import { PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_DEPTH, PADDLE_VELOCITY } from "./constants";

interface ConstructorParameters<Side extends PaddleSide> {
  side: Side;
  physMat: Material;
  pos: Vec3;
}

export class Paddle<Side extends PaddleSide> {
  public readonly side: Side;
  public readonly lastMove: PaddleMove = "stop";
  public readonly body: Body;
  private shape = new Box(new Vec3(PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_DEPTH));
  private pos: Vec3;

  constructor({ side, physMat, pos }: ConstructorParameters<Side>) {
    this.side = side;
    this.pos = pos;
    this.body = new Body({
      mass: 50,
      shape: this.shape,
      material: physMat,
    });
    this.body.position.set(pos.x, pos.y, pos.z);
    this.body.velocity.set(0, 0, 0);
  }

  public initRound(): void {
    this.body.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.body.velocity.set(0, 0, 0);
  }

  private getVelocity(move: PaddleMove): number {
    switch (move) {
      case "up":
        return PADDLE_VELOCITY;
      case "down":
        return -PADDLE_VELOCITY;
      default:
        return 0;
    }
  }

  public move(move: PaddleMove): void {
    const newVelocity = this.getVelocity(move);
    this.body.velocity.set(0, newVelocity, 0);
  }

  public getState(): PaddleState {
    return {
      side: this.side,
      lastMove: this.lastMove,
      pos: this.body.position,
      width: this.shape.halfExtents.x,
      height: this.shape.halfExtents.y,
      depth: this.shape.halfExtents.z,
      velocity: this.body.velocity.y,
    };
  }
}
