import type { BallState } from "../@types";

interface BallParameters {
  ball: BallState;
  delta: number;
  rotFactor: React.MutableRefObject<number>;
}

export const updateBall = ({ ball, delta, rotFactor }: BallParameters): void => {
  ball.posX += ball.velX * delta;
  ball.posY += ball.velY * delta;

  ball.velX += ball.accX * delta;
  ball.velY += ball.accY * delta;

  ball.rot += 2 * Math.PI * delta * rotFactor.current;
};
