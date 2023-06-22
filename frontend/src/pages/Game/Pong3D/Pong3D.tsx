import React, { Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GAME_DEPTH, GAME_HEIGHT, GAME_WIDTH } from "@shared/pongCore/constants";

import "./Pong3D.css";

import { CAMERA_3D_Z } from "../constants";
import { useGameLoop, useScoreLabel, useGameContext } from "../hooks";
import { type GameContextParameters } from "../@types";
import { getInitialPongState } from "../helpers";

import { Ball, Board, Paddle, Score } from "./components";

const INITIAL_PONG_STATE = getInitialPongState();

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
  useThree(({ camera }) => {
    camera.position.set(0, 0, CAMERA_3D_Z);
  });

  const scoreLabel = useScoreLabel();
  const { paddleLeftRef, paddleRightRef, ballRef } = useGameLoop();

  return (
    <>
      <Light />
      <Board />
      <Score score={scoreLabel} />
      <Ball ballRef={ballRef} initialPos={INITIAL_PONG_STATE.ball.pos} />
      <Paddle paddleRef={paddleLeftRef} initialPos={INITIAL_PONG_STATE.paddleLeft.pos} />
      <Paddle paddleRef={paddleRightRef} initialPos={INITIAL_PONG_STATE.paddleRight.pos} />
      <OrbitControls />
    </>
  );
};

const Loading: React.FC = () => {
  return <h2>Loading...</h2>;
};

const _Pong3D: React.FC = () => {
  const { gameMode }: GameContextParameters = useGameContext();

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
