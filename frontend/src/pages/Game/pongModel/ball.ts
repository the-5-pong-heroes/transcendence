import { Sphere, Body, Material } from "cannon-es";

import { type BallState } from "./@types";
import { BALL_RADIUS } from "./constants";

export class Ball {
  public readonly body: Body;
  public readonly physMat = new Material();
  private shape = new Sphere(BALL_RADIUS);

  constructor() {
    this.body = new Body({
      mass: 10,
      shape: this.shape,
      material: this.physMat,
    });
    this.body.position.set(0, 0, 0);
    this.body.velocity.set(300, -100, 0);
  }

  initRound(): void {
    this.body.position.set(0, 0, 0);
    this.body.velocity.set(300, -100, 0);
  }

  getState(): BallState {
    return {
      radius: this.shape.boundingSphereRadius,
      pos: this.body.position,
      rot: 0,
      velX: this.body.velocity.x,
      velY: this.body.velocity.y,
    };
  }
}
