/* eslint-disable no-magic-numbers */

import { Vec3 } from "cannon-es";
import {
  GAME_WIDTH,
  BALL_RADIUS,
  BALL_VEL_X,
  BALL_VEL_Y,
  PADDLE_DEPTH,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_VELOCITY,
} from "@shared/pongCore/constants";

import type { PongState } from "../@types/states";

export const getInitialPongState = (): PongState => ({
  ball: {
    radius: BALL_RADIUS,
    pos: new Vec3(0, 0, 0),
    rot: 0,
    velX: BALL_VEL_X,
    velY: BALL_VEL_Y,
  },
  paddleRight: {
    side: "right",
    lastMove: "stop",
    height: PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    depth: PADDLE_DEPTH,
    pos: new Vec3(GAME_WIDTH / 2 - PADDLE_WIDTH * 2.5, 0, 0),
    velocity: PADDLE_VELOCITY,
  },
  paddleLeft: {
    side: "left",
    lastMove: "stop",
    height: PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    depth: PADDLE_DEPTH,
    pos: new Vec3(-GAME_WIDTH / 2 + PADDLE_WIDTH * 2.5, 0, 0),
    velocity: PADDLE_VELOCITY,
  },
});
