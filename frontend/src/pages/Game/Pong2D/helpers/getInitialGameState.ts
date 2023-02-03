import type { GameState } from "../@types";
import {
  BALL_RADIUS_RATIO,
  PADDLE_OFFSET_RATIO,
  PADDLE_WIDTH_RATIO,
  PADDLE_HEIGHT_RATIO,
  INITIAL_BALL_VEL_X_RATIO,
  INITIAL_BALL_VEL_Y_RATIO,
} from "../constants";

// const INITIAL_BALL_VEL_X = 10;
// const INITIAL_BALL_VEL_Y = 4;

interface InitParameters {
  width: number;
  height: number;
  score?: GameState["score"];
}

const getBallVelX = ({ width, height, score }: InitParameters): number => {
  const velX = width * INITIAL_BALL_VEL_X_RATIO;

  return score?.round ? (score.round % 2 === 0 ? velX : -velX) : velX;
};

export const getInitialGameState = ({ width, height, score }: InitParameters): GameState => ({
  ball: {
    radius: height * BALL_RADIUS_RATIO,
    posX: width / 2,
    posY: height / 2,
    velX: getBallVelX({ width, height, score }),
    velY: height * INITIAL_BALL_VEL_Y_RATIO,
    accX: 0,
    accY: 0,
    rot: 0,
  },
  paddleRight: {
    height: height * PADDLE_HEIGHT_RATIO,
    width: width * PADDLE_WIDTH_RATIO,
    posX: width - width * PADDLE_WIDTH_RATIO - width * PADDLE_OFFSET_RATIO,
    posY: 2 * height * PADDLE_HEIGHT_RATIO,
  },
  paddleLeft: {
    height: height * PADDLE_HEIGHT_RATIO,
    width: width * PADDLE_WIDTH_RATIO,
    posX: width * PADDLE_OFFSET_RATIO,
    posY: 2 * height * PADDLE_HEIGHT_RATIO,
  },
  score: {
    player1: score ? score.player1 : 0,
    player2: score ? score.player2 : 0,
    round: score ? score.round : 0,
  },
});
