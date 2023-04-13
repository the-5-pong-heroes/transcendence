import React, { Suspense, useContext } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import "./Pong3D.css";

import { GAME_DEPTH, GAME_HEIGHT, GAME_WIDTH } from "../pongCore/constants";
import type { GameMode } from "../@types";
import { CAMERA_3D_Z } from "../constants";
import { useGameLoop, useScoreLabel, useGameEvents } from "../hooks";
import { GameContext } from "../context/GameContext";
import { getInitialPongState } from "../helpers";

import { Ball, Board, Paddle, Score, ParticleSystem } from "./components";

const INITIAL_PONG_STATE = getInitialPongState();

interface GameProps {
  gameMode: GameMode | undefined;
}

const Light: React.FC = () => {
  return (
    <>
      <ambientLight />
      <pointLight position={[GAME_WIDTH * (3 / 4), GAME_HEIGHT * (3 / 4), GAME_DEPTH * (3 / 4)]} intensity={1.5} />
      <pointLight position={[-GAME_WIDTH * (3 / 4), GAME_HEIGHT * (3 / 4), -GAME_DEPTH * (1 / 2)]} intensity={1} />
    </>
  );
};

const PongGame: React.FC = () => {
  useGameEvents();

  useThree(({ camera }) => {
    camera.position.set(0, 0, CAMERA_3D_Z);
  });

  const scoreLabel = useScoreLabel();
  const { paddleLeftRef, paddleRightRef, ballRef, particlesRef } = useGameLoop();

  return (
    <>
      <Light />
      <Board />
      <Score score={scoreLabel} />
      <Ball ballRef={ballRef} initialPos={INITIAL_PONG_STATE.ball.pos} />
      <Paddle paddleRef={paddleLeftRef} initialPos={INITIAL_PONG_STATE.paddleLeft.pos} />
      <Paddle paddleRef={paddleRightRef} initialPos={INITIAL_PONG_STATE.paddleRight.pos} />
      {/* <ParticleSystem particlesRef={particlesRef} initialPos={INITIAL_PONG_STATE.ball.pos} /> */}
      <OrbitControls />
      <axesHelper args={[GAME_WIDTH]} />
    </>
  );
};

const Loading: React.FC = () => {
  return <h2>Loading...</h2>;
};

const _Pong3D: React.FC = () => {
  const gameContext = useContext(GameContext);
  if (gameContext === undefined) {
    throw new Error("Undefined GameContext");
  }
  const { gameMode }: GameProps = gameContext;

  if (gameMode != "3D") {
    return null;
  }

  return (
    <div className="canvas-container">
      <Suspense fallback={<Loading />}>
        <Canvas>
          <PongGame />
        </Canvas>
      </Suspense>
    </div>
  );
};

export const Pong3D = React.memo(_Pong3D);
