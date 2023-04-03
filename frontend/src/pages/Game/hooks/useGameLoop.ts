import { useRef, useEffect, useCallback, useContext } from "react";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

import type { Pong } from "../pongCore";
import { GameContext } from "../context";
import type { PlayState, ServerPong } from "../@types";

import { useControlledPaddle } from "./useControlledPaddle";

const REFRESH_RATE = 1000 / 60;

interface GameLoopParameters {
  playRef: React.MutableRefObject<PlayState>;
  localPongRef: React.MutableRefObject<Pong>;
  serverPongRef: React.MutableRefObject<ServerPong | undefined>;
}

interface GameLoopValues {
  ballRef: React.RefObject<THREE.Mesh>;
  paddleLeftRef: React.RefObject<THREE.Mesh>;
  paddleRightRef: React.RefObject<THREE.Mesh>;
  particlesRef: React.RefObject<THREE.Points>;
}

interface UniformsParameters {
  uTime: { value: number };
  uRadius: { value: number };
  [uniform: string]: THREE.IUniform; // allows for additional uniform properties
}

interface ParticleSystemMaterial extends THREE.ShaderMaterial {
  uniforms: UniformsParameters;
}

export const useGameLoop = (): GameLoopValues => {
  const gameContext = useContext(GameContext);
  if (gameContext === undefined) {
    throw new Error("Undefined GameContext");
  }
  const { playRef, localPongRef, serverPongRef }: GameLoopParameters = gameContext;

  useControlledPaddle();

  const ballRef = useRef<THREE.Mesh>(null);
  const paddleLeftRef = useRef<THREE.Mesh>(null);
  const paddleRightRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  /* Logic loop */
  const gameLoop = useCallback(
    (delta: number): void => {
      if (serverPongRef.current && !serverPongRef.current?.evaluated) {
        localPongRef.current.ball.set(serverPongRef.current.pong.ball);
        serverPongRef.current.evaluated = true;
      }

      localPongRef.current.update(delta);
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
    };
  }, [gameLoop, playRef]);

  /* Render loop */
  useFrame(({ clock }) => {
    if (playRef.current.paused) {
      return;
    }
    const { ball, paddleRight, paddleLeft } = localPongRef.current.getState();

    paddleLeftRef.current?.position.set(paddleLeft.pos.x, paddleLeft.pos.y, paddleLeft.pos.z);
    paddleRightRef.current?.position.set(paddleRight.pos.x, paddleRight.pos.y, paddleRight.pos.z);
    ballRef.current?.position.set(ball.pos.x, ball.pos.y, ball.pos.z);

    if (particlesRef.current && ballRef.current) {
      const material = particlesRef.current.material as ParticleSystemMaterial;
      material.uniforms.uTime.value = clock.elapsedTime;
      material.uniforms.uBallPosition.value = new Vector3(
        ballRef.current.position.x,
        ballRef.current.position.y,
        ballRef.current.position.z
      );
    }
  });

  return { paddleLeftRef, paddleRightRef, ballRef, particlesRef };
};
