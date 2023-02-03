/* eslint max-lines: ["warn", 125] */
/* eslint-disable no-magic-numbers */

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

import type { GameOverlayRef } from "../../GameOverlay";
import type { GameState, PlayState } from "../@types";
import { computeScoreLabel, getInitialGameState } from "../helpers";
import {
  getCollisions,
  handleWallCollision,
  handlePaddleCollision,
  updateBall,
  updatePaddles,
  handleMissedCollision,
} from "../physics";

import { useControlledPaddle } from "./useControlledPaddle";

interface GameLoopParameters {
  width: number;
  height: number;
  depth: number;
  playRef: React.MutableRefObject<PlayState>;
  overlayRef: React.RefObject<GameOverlayRef>;
}

interface GameLoopValues {
  gameRef: React.MutableRefObject<GameState>;
  ballRef: React.RefObject<THREE.Mesh>;
  paddleLeftRef: React.RefObject<THREE.Mesh>;
  paddleRightRef: React.RefObject<THREE.Mesh>;
  scoreLabel: string;
}

export const useGameLoop = ({ width, height, depth, playRef, overlayRef }: GameLoopParameters): GameLoopValues => {
  const rotFactor = useRef<number>(Math.PI / 6);

  const { velY: paddleRightVelY } = useControlledPaddle();

  const gameRef = useRef<GameState>(
    getInitialGameState({ width, height, depth, score: { player1: 0, player2: 0, round: 0 } })
  );

  const ballRef = useRef<THREE.Mesh>(null);
  const paddleLeftRef = useRef<THREE.Mesh>(null);
  const paddleRightRef = useRef<THREE.Mesh>(null);

  const [scoreLabel, setScoreLabel] = useState<string>(computeScoreLabel(gameRef.current.score));

  useFrame((_, delta) => {
    if (playRef.current.paused) {
      return;
    }

    const { ball, paddleLeft, paddleRight, score } = gameRef.current;

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
        depth,
        score,
        gameRef,
        overlayRef,
        playRef,
      });
    }
    if (reachedLeft) {
      return handleMissedCollision({
        collisionSide: "left",
        width,
        height,
        depth,
        score,
        gameRef,
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

    // Update refs
    paddleLeftRef.current?.position.set(paddleLeft.posX, paddleLeft.posY, paddleLeft.posZ);
    paddleRightRef.current?.position.set(paddleRight.posX, paddleRight.posY, paddleRight.posZ);
    ballRef.current?.position.set(ball.posX, ball.posY, ball.posZ);
    ballRef.current?.rotateZ(ball.rot);

    // Update state
    gameRef.current = { ball, paddleRight, paddleLeft, score };
    setScoreLabel(computeScoreLabel(score));
  });

  return { gameRef, paddleLeftRef, paddleRightRef, ballRef, scoreLabel };
};
