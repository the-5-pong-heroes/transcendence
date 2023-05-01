import { type Vec3 } from "cannon-es";

import type { PaddleSide, PaddleMove } from "../Game";

// export type PaddleState = {
//   posX: number;
//   posY: number;
//   posZ: number;
//   height: number;
//   width: number;
//   depth: number;
// };

export type PaddleState = {
  side: PaddleSide;
  lastMove: PaddleMove;
  pos: Vec3;
  height: number;
  width: number;
  depth: number;
  velocity: number;
};
