import { Vec3 } from "cannon-es";

import type { GameState } from "../@types/states";
import { GAME_WIDTH, GAME_DEPTH, BALL_RADIUS, PADDLE_DEPTH, PADDLE_HEIGHT, PADDLE_WIDTH, OFFSET_Z } from "../constants";

export const getInitialGameState = (): GameState => ({
  ball: {
    radius: BALL_RADIUS,
    pos: new Vec3(0, 0, -GAME_DEPTH / 2 + PADDLE_DEPTH + OFFSET_Z),
    rot: 0,
  },
  paddleRight: {
    side: "right",
    lastMove: "stop",
    height: PADDLE_HEIGHT,
    width: PADDLE_WIDTH + 5,
    depth: PADDLE_DEPTH,
    pos: new Vec3(GAME_WIDTH / 2 - PADDLE_WIDTH * 2, 0, -GAME_DEPTH / 2 + PADDLE_DEPTH + OFFSET_Z),
  },
  paddleLeft: {
    side: "left",
    lastMove: "stop",
    height: PADDLE_HEIGHT,
    width: PADDLE_WIDTH - 5,
    depth: PADDLE_DEPTH,
    pos: new Vec3(-GAME_WIDTH / 2 + PADDLE_WIDTH * 2, 0, -GAME_DEPTH / 2 + PADDLE_DEPTH + OFFSET_Z),
  },
  score: {
    player1: 0,
    player2: 0,
    round: 0,
  },
  play: {
    started: false,
    paused: true,
  },
});
