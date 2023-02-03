import type { BallState, GameSide } from "../@types";
import { getRandomRotFactor } from "../helpers";

interface WallCollisionParameters {
  collision: GameSide;
  ball: BallState;
  rotFactor: React.MutableRefObject<number>;
}

export const handleWallCollision = ({ collision, ball, rotFactor }: WallCollisionParameters): void => {
  if (collision === "bottom") {
    ball.velY = -Math.abs(ball.velY);
    ball.accX = -Math.abs(ball.accY);
  }
  if (collision === "top") {
    ball.velY = Math.abs(ball.velY);
    ball.accY = Math.abs(ball.accY);
  }
  rotFactor.current = getRandomRotFactor();
};
