import type { GameState } from "../@types";
import {
  BALL_RADIUS_RATIO,
  PADDLE_DEPTH_RATIO,
  PADDLE_HEIGHT_RATIO,
  PADDLE_WIDTH_RATIO,
  INITIAL_BALL_VEL_X,
  INITIAL_BALL_VEL_Y,
} from "../constants";

const OFFSET_Z = 2;

interface InitParameters {
  width: number;
  height: number;
  depth: number;
  score?: GameState["score"];
}

export const getInitialGameState = ({ width, height, depth, score }: InitParameters): GameState => ({
  ball: {
    radius: width * BALL_RADIUS_RATIO,
    posX: 0,
    posY: 0,
    posZ: -depth / 2 + depth * PADDLE_DEPTH_RATIO + OFFSET_Z,
    velX: score?.round ? (score.round % 2 === 0 ? INITIAL_BALL_VEL_X : -INITIAL_BALL_VEL_X) : INITIAL_BALL_VEL_X,
    velY: INITIAL_BALL_VEL_Y,
    accX: 0,
    accY: 0,
    rot: 0,
  },
  paddleRight: {
    height: height * PADDLE_HEIGHT_RATIO,
    width: width * PADDLE_WIDTH_RATIO + 5,
    depth: depth * PADDLE_DEPTH_RATIO,
    posX: width / 2 - width * PADDLE_WIDTH_RATIO * 2,
    posY: 0,
    posZ: -depth / 2 + depth * PADDLE_DEPTH_RATIO + OFFSET_Z,
  },
  paddleLeft: {
    height: height * PADDLE_HEIGHT_RATIO,
    width: width * PADDLE_WIDTH_RATIO - 5,
    depth: depth * PADDLE_DEPTH_RATIO,
    posX: -width / 2 + width * PADDLE_WIDTH_RATIO * 2,
    posY: 0,
    posZ: -depth / 2 + depth * PADDLE_DEPTH_RATIO + OFFSET_Z,
  },
  score: {
    player1: score ? score.player1 : 0,
    player2: score ? score.player2 : 0,
    round: score ? score.round : 0,
  },
  play: {
    started: false,
    paused: true,
  },
});
