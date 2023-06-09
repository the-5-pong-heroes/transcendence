import {
  BALL_OFFSET_X_RATIO,
  BALL_OFFSET_Y_RATIO,
  GAME_WIDTH,
  GAME_HEIGHT,
  MIN_ROT_FACTOR,
  MAX_ROT_FACTOR,
} from "../constants";
import { type Ball } from "../ball";
import { type Paddle } from "../paddle";

const OFFSET_SIDE_WALL = 50;

export const reachedRightPaddle = (
  ball: Ball,
  paddle: Paddle<"right">,
): boolean => {
  return (
    ball.posX + ball.radius * BALL_OFFSET_X_RATIO >=
      paddle.posX - paddle.width / 2 &&
    ball.posY + ball.radius * BALL_OFFSET_Y_RATIO >=
      paddle.posY - paddle.height / 2 &&
    ball.posY - ball.radius * BALL_OFFSET_Y_RATIO <=
      paddle.posY + paddle.height / 2
  );
};

export const reachedLeftPaddle = (
  ball: Ball,
  paddle: Paddle<"left">,
): boolean => {
  return (
    ball.posX - ball.radius * BALL_OFFSET_X_RATIO <=
      paddle.posX + paddle.width / 2 &&
    ball.posY + ball.radius * BALL_OFFSET_Y_RATIO >=
      paddle.posY - paddle.height / 2 &&
    ball.posY - ball.radius * BALL_OFFSET_Y_RATIO <=
      paddle.posY + paddle.height / 2
  );
};

export const reachedRight = (ball: Ball): boolean => {
  return ball.posX + ball.radius >= GAME_WIDTH / 2 + OFFSET_SIDE_WALL;
};

export const reachedLeft = (ball: Ball): boolean => {
  return ball.posX - ball.radius <= -GAME_WIDTH / 2 - OFFSET_SIDE_WALL;
};

export const reachedBottom = (ball: Ball): boolean => {
  return ball.posY + ball.radius >= GAME_HEIGHT / 2;
};

export const reachedTop = (ball: Ball): boolean => {
  return ball.posY - ball.radius <= -GAME_HEIGHT / 2;
};

export const getRandomRotFactor = (): number => {
  return Math.random() * (MAX_ROT_FACTOR - MIN_ROT_FACTOR) + MIN_ROT_FACTOR;
};
