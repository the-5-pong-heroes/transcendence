import type { BallState, PaddleState } from "../@types";

interface PaddlesParameters {
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
}: PaddlesParameters): void => {
  paddleRight.posY += paddleRightVelY.current * delta;
  paddleRight.posY = Math.max(
    -height / 2 + paddleRight.height / 2 + 1,
    Math.min(height / 2 - paddleRight.height / 2 - 1, paddleRight.posY)
  );

  paddleLeft.posY = ball.posY;
  paddleLeft.posY = Math.max(
    -height / 2 + paddleLeft.height / 2 + 1,
    Math.min(height / 2 - paddleLeft.height / 2 - 1, paddleLeft.posY)
  );
};
