import type { GameState } from "../@types";
import { BALL_OFFSET_RATIO } from "../constants";

interface CollisionsParameters {
  width: number;
  height: number;
  ball: GameState["ball"];
  paddleRight: GameState["paddleRight"];
  paddleLeft: GameState["paddleLeft"];
}

interface CollisionsState {
  reachedRightPaddle: boolean;
  reachedRight: boolean;
  reachedLeftPaddle: boolean;
  reachedLeft: boolean;
  reachedBottom: boolean;
  reachedTop: boolean;
}

export const getCollisions = ({
  width,
  height,
  ball,
  paddleRight,
  paddleLeft,
}: CollisionsParameters): CollisionsState => {
  const reachedRightPaddle =
    ball.posX + ball.radius >= paddleRight.posX &&
    ball.posY + ball.radius * BALL_OFFSET_RATIO >= paddleRight.posY - paddleRight.height / 2 &&
    ball.posY - ball.radius * BALL_OFFSET_RATIO <= paddleRight.posY + paddleRight.height / 2;

  const reachedRight = ball.posX + ball.radius >= width / 2;

  const reachedLeftPaddle =
    ball.posX - ball.radius <= paddleLeft.posX &&
    ball.posY + ball.radius * BALL_OFFSET_RATIO >= paddleLeft.posY - paddleLeft.height / 2 &&
    ball.posY - ball.radius * BALL_OFFSET_RATIO <= paddleLeft.posY + paddleLeft.height / 2;

  const reachedLeft = ball.posX - ball.radius <= -width / 2;

  const reachedBottom = ball.posY + ball.radius >= height / 2;

  const reachedTop = ball.posY - ball.radius <= -height / 2;

  return { reachedRightPaddle, reachedRight, reachedLeftPaddle, reachedLeft, reachedBottom, reachedTop };
};
