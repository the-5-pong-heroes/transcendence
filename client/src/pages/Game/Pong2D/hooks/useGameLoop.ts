/* eslint max-lines: ["warn", 120] */
/* eslint-disable no-magic-numbers */

import { useReducer, useRef } from "react";
import { usePixiTicker } from "react-pixi-fiber/index.js";

import type { GameOverlayRef } from "../../GameOverlay";
import type { GameState, PlayState } from "../@types";
import { getInitialGameState } from "../helpers";
import {
  getCollisions,
  handleWallCollision,
  handlePaddleCollision,
  updateBall,
  updatePaddles,
  handleMissedCollision,
} from "../physics";
import { gameReducer } from "../reducer";

import { useControlledPaddle } from "./useControlledPaddle";

import { BALL_RADIUS_RATIO } from "../constants";

interface GameParameters {
  width: number;
  height: number;
  playRef: React.MutableRefObject<PlayState>;
  overlayRef: React.RefObject<GameOverlayRef>;
}

export const useGameLoop = ({ width, height, playRef, overlayRef }: GameParameters): GameState => {
  const rotFactor = useRef<number>(0.01);

  const { velY: paddleRightVelY } = useControlledPaddle();

  const [motion, dispatch] = useReducer(gameReducer, getInitialGameState({ width, height }));

  usePixiTicker((delta) => {
    if (playRef.current.paused) {
      return;
    }

    const ball = { ...motion.ball };
    const paddleLeft = { ...motion.paddleLeft };
    const paddleRight = { ...motion.paddleRight };
    const score = { ...motion.score };

    ball.radius = height * BALL_RADIUS_RATIO;
    paddleRight.height = height / 5;
    paddleLeft.height = height / 5;

    // Update paddles position
    updatePaddles({ ball, paddleRight, paddleRightVelY, paddleLeft, height, delta });

    // Update ball position
    updateBall({ ball, delta, rotFactor });

    // Check collisions
    const { reachedRightPaddle, reachedRight, reachedLeftPaddle, reachedLeft, reachedBottom, reachedTop } =
      getCollisions({ height, width, ball, paddleRight, paddleLeft });

    // Reached paddle
    if (reachedRightPaddle) {
      handlePaddleCollision({ collisionSide: "right", ball, paddle: paddleRight, rotFactor });
    }
    if (reachedLeftPaddle) {
      handlePaddleCollision({ collisionSide: "left", ball, paddle: paddleLeft, rotFactor });
    }

    // Missed paddle
    if (reachedRight) {
      return handleMissedCollision({
        collisionSide: "right",
        width,
        height,
        score,
        dispatch,
        overlayRef,
        playRef,
      });
    }
    if (reachedLeft) {
      return handleMissedCollision({
        collisionSide: "left",
        width,
        height,
        score,
        dispatch,
        overlayRef,
        playRef,
      });
    }

    // Reached wall
    if (reachedBottom) {
      handleWallCollision({ collision: "bottom", ball, rotFactor });
    }
    if (reachedTop) {
      handleWallCollision({ collision: "top", ball, rotFactor });
    }

    // Update state
    dispatch({ type: "update", data: { ball, paddleRight, paddleLeft, score } });
  });

  return motion;
};
