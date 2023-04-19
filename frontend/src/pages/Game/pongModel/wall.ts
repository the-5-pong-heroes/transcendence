import { Box, Body, type Material, type Vec3, type Shape } from "cannon-es";

import { type WallSide } from "./@types";

interface ConstructorParameters<Side extends WallSide> {
  side: Side;
  shape: Vec3;
  physMat: Material;
  pos: Vec3;
}

export class Wall<Side extends WallSide> {
  public readonly side: Side;
  public readonly body: Body;
  private shape: Shape;

  constructor({ side, shape, physMat, pos }: ConstructorParameters<Side>) {
    this.side = side;
    this.shape = new Box(shape);
    this.body = new Body({
      mass: 0,
      shape: this.shape,
      material: physMat,
    });
    this.body.position.set(pos.x, pos.y, pos.z);
  }
}
