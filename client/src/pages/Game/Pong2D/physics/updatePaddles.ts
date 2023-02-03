import type { BallState, PaddleState } from "../@types";

interface paddlesParameters {
  ball: BallState;
  paddleRight: PaddleState;
  paddleRightVelY: React.MutableRefObject<number>;
  height: number;
  paddleLeft: PaddleState;
  delta: number;
}

export const updatePaddles = ({
  ball,
  paddleRight,
  paddleRightVelY,
  height,
  paddleLeft,
  delta,
}: paddlesParameters): void => {
  paddleRight.posY += paddleRightVelY.current * delta;
  paddleRight.posY = Math.max(0, Math.min(height - paddleRight.height, paddleRight.posY));

  paddleLeft.posY = ball.posY - paddleLeft.height / 2;
  paddleLeft.posY = Math.max(0, Math.min(height - paddleLeft.height, paddleLeft.posY));
};
