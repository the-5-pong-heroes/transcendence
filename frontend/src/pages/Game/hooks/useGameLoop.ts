/* eslint max-lines: ["warn", 135] */
/* eslint-disable no-magic-numbers */

import { useRef, useEffect, useCallback, useContext } from "react";
import { useFrame } from "@react-three/fiber";
import type { Pong } from "shared/pongCore";

import { GameContext } from "../context";
import type { PlayState, ServerPong } from "../@types";
import { ServerEvents } from "../@types";
import { SocketContext } from "../../../contexts";
// import type { Pong } from "../pongCore";

import { useControlledPaddle } from "./useControlledPaddle";

interface GameLoopParameters {
  playRef: React.MutableRefObject<PlayState>;
  localPongRef: React.MutableRefObject<Pong>;
  serverPongRef: React.MutableRefObject<ServerPong | undefined>;
}

interface GameLoopValues {
  ballRef: React.RefObject<THREE.Mesh>;
  paddleLeftRef: React.RefObject<THREE.Mesh>;
  paddleRightRef: React.RefObject<THREE.Mesh>;
}

export const useGameLoop = (): GameLoopValues => {
  const gameContext = useContext(GameContext);
  if (gameContext === undefined) {
    throw new Error("Undefined GameContext");
  }
  const { playRef, localPongRef, serverPongRef }: GameLoopParameters = gameContext;

  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error("Undefined SocketContext");
  }
  const { socketRef } = socketContext;

  useControlledPaddle();

  const ballRef = useRef<THREE.Mesh>(null);
  const paddleLeftRef = useRef<THREE.Mesh>(null);
  const paddleRightRef = useRef<THREE.Mesh>(null);

  const gameLoop = useCallback(
    (delta: number): void => {
      if (playRef.current.paused) {
        return;
      }
      if (localPongRef.current && serverPongRef.current && !serverPongRef.current?.evaluated) {
        localPongRef.current.set(serverPongRef.current.pong);
        serverPongRef.current.evaluated = true;
      }
      localPongRef.current.update(delta);
      const collisionSide = localPongRef.current.detectCollisions();

      const { ball, paddleRight, paddleLeft } = localPongRef.current.getState();

      paddleLeftRef.current?.position.set(paddleLeft.pos.x, paddleLeft.pos.y, paddleLeft.pos.z);
      paddleRightRef.current?.position.set(paddleRight.pos.x, paddleRight.pos.y, paddleRight.pos.z);
      ballRef.current?.position.set(ball.pos.x, ball.pos.y, ball.pos.z);

      if (collisionSide !== "none") {
        playRef.current.paused = true;
      }
    },
    [playRef, localPongRef, serverPongRef]
  );

  const timeRef = useRef<number>(Date.now());
  useFrame(() => {
    const currentTime = Date.now();
    const deltaTime = currentTime - timeRef.current;
    gameLoop(deltaTime);
    timeRef.current = currentTime;
  });

  const updateGame = useCallback(
    (serverPong: Pong) => {
      serverPongRef.current = {
        pong: serverPong,
        evaluated: false,
      };
    },
    [serverPongRef]
  );

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }
    socket.on(ServerEvents.GameUpdate, updateGame);

    return () => {
      socket.off(ServerEvents.GameUpdate);
    };
  }, [socketRef, updateGame]);

  return { paddleLeftRef, paddleRightRef, ballRef };
};
