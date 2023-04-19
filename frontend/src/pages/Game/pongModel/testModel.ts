import { Sphere, Body, Material, type Vec3 } from "cannon-es";

type BallState = {
  radius: number;
  pos: Vec3;
  rot: number;
  velX: number;
  velY: number;
};

const BALL_RADIUS = 15;

class Ball {
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
}
