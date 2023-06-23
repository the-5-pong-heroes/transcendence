import { useRef, useEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";

import type { GameContextParameters } from "../@types";
import { REFRESH_RATE } from "../constants";

import { useGameContext } from "./useGameContext";
import { useControlledPaddle } from "./useControlledPaddle";

import type { GameState } from "@types";
import { useAppContext } from "@hooks";

interface GameLoopValues {
  ballRef: React.RefObject<THREE.Mesh>;
  paddleLeftRef: React.RefObject<THREE.Mesh>;
  paddleRightRef: React.RefObject<THREE.Mesh>;
}

export const useGameLoop = (): GameLoopValues => {
  const { playRef, localPongRef, serverPongRef, gameMode }: GameContextParameters = useGameContext();
  const { isRunning }: GameState = useAppContext().gameState;

  useControlledPaddle();

  const ballRef = useRef<THREE.Mesh>(null);
  const paddleLeftRef = useRef<THREE.Mesh>(null);
  const paddleRightRef = useRef<THREE.Mesh>(null);

  /* Logic loop */
  const gameLoop = useCallback(
    (delta: number): void => {
      if (serverPongRef.current && !serverPongRef.current?.evaluated) {
        localPongRef.current.ball.set(serverPongRef.current.pong.ball);
        serverPongRef.current.evaluated = true;
      }

      localPongRef.current.update(delta);
      localPongRef.current.detectCollisions();
    },
    [localPongRef, serverPongRef]
  );

  const timeRef = useRef<number>(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = currentTime - timeRef.current;
      if (!playRef.current.paused) {
        gameLoop(deltaTime);
      }
      timeRef.current = currentTime;
    }, REFRESH_RATE);

    return () => {
      clearInterval(intervalId);
      isRunning.current = false;
    };
  }, [gameLoop, playRef, isRunning]);

  /* Render loop */
  useFrame(({ clock }) => {
    if (playRef.current.paused) {
      return;
    }
    const { ball, paddleRight, paddleLeft } = localPongRef.current.getState();

    paddleLeftRef.current?.position.set(paddleLeft.pos.x, paddleLeft.pos.y, paddleLeft.pos.z);
    paddleRightRef.current?.position.set(paddleRight.pos.x, paddleRight.pos.y, paddleRight.pos.z);
    ballRef.current?.position.set(ball.pos.x, ball.pos.y, ball.pos.z);
    if (ballRef.current && gameMode === "3D") {
      ballRef.current.rotation.set(ball.rot, ball.rot, 0);
    }
  });

  return { paddleLeftRef, paddleRightRef, ballRef };
};
