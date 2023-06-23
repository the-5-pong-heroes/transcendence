import React, { Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";

import "./Pong2D.css";

import { CAMERA_2D_Z } from "../constants";
import { type GameContextParameters } from "../@types";
import { useGameLoop, useScoreLabel, useGameContext } from "../hooks";
import { getInitialPongState } from "../helpers";

import { Ball, Board, Paddle, Score, DashedLine } from "./components";

const INITIAL_PONG_STATE = getInitialPongState();

const Light: React.FC = () => {
  return (
    <>
      <ambientLight />
    </>
  );
};

const PongGame: React.FC = () => {
  useThree(({ camera }) => {
    camera.position.set(0, 0, CAMERA_2D_Z);
  });

  const scoreLabel = useScoreLabel();
  const { paddleLeftRef, paddleRightRef, ballRef } = useGameLoop();

  return (
    <>
      <OrthographicCamera />
      <Light />
      <Board />
      <DashedLine />
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

const _Pong2D: React.FC = () => {
  const { gameMode }: GameContextParameters = useGameContext();

  if (gameMode != "2D") {
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

export const Pong2D = React.memo(_Pong2D);
