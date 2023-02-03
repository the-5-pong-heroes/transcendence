import type { BallState, PaddleSide, PaddleState } from "../@types";
import { getRandomRotFactor } from "../helpers";
import { BALL_ACC_X, MAX_BOUNCE_ANGLE } from "../constants";

interface PaddleCollisionParameters {
  collisionSide: PaddleSide;
  ball: BallState;
  paddle: PaddleState;
  rotFactor: React.MutableRefObject<number>;
}

export const handlePaddleCollision = ({ collisionSide, ball, paddle, rotFactor }: PaddleCollisionParameters): void => {
  let paddleCenter: number;
  let dist: number;

  if (collisionSide === "right") {
    paddleCenter = paddle.posY + paddle.height / 2;
    dist = (paddleCenter - ball.posY) / (paddle.height / 2);
    ball.velX += Math.cos(dist * MAX_BOUNCE_ANGLE);
    ball.velY += -Math.sin(dist * MAX_BOUNCE_ANGLE);

    ball.velX = -Math.abs(ball.velX);
    ball.accX = -Math.abs(ball.accX) + BALL_ACC_X;

    rotFactor.current = getRandomRotFactor();
  }
  if (collisionSide === "left") {
    paddleCenter = paddle.posY + paddle.height / 2;
    dist = (paddleCenter - ball.posY) / (paddle.height / 2);
    ball.velX += Math.cos(dist * MAX_BOUNCE_ANGLE);
    ball.velY += -Math.sin(dist * MAX_BOUNCE_ANGLE);

    ball.velX = Math.abs(ball.velX);
    ball.accX = Math.abs(ball.accX) + BALL_ACC_X;

    rotFactor.current = getRandomRotFactor();
  }
};
