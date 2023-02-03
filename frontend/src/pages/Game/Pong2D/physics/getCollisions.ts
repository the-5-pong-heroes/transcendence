import type { GameState } from "../@types";

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
    ball.posY + ball.radius >= paddleRight.posY &&
    ball.posY + ball.radius <= paddleRight.posY + paddleRight.height;

  const reachedRight = ball.posX + ball.radius >= width;

  const reachedLeftPaddle =
    ball.posX - ball.radius <= paddleLeft.posX + paddleLeft.width &&
    ball.posY - ball.radius >= paddleLeft.posY &&
    ball.posY - ball.radius <= paddleLeft.posY + paddleLeft.height;

  const reachedLeft = ball.posX - ball.radius <= 0;

  const reachedBottom = ball.posY + ball.radius >= height;

  const reachedTop = ball.posY - ball.radius <= 0;

  return { reachedRightPaddle, reachedRight, reachedLeftPaddle, reachedLeft, reachedBottom, reachedTop };
};
