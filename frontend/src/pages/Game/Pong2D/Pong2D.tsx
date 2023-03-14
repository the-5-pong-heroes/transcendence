/* eslint-disable no-magic-numbers */

import React, { Suspense, useContext } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";

import "./Pong2D.css";

import { GameContext } from "../context/GameContext";
import type { GameMode } from "../@types";
import { GAME_WIDTH } from "../constants";
import { useGameLoop, useScoreLabel, useGameEvents } from "../hooks";
import { getInitialGameState } from "../helpers";

import { Ball, Board, Paddle, Score, DashedLine } from "./components";

interface GameProps {
  gameMode: GameMode | undefined;
}

const Light: React.FC = () => {
  return (
    <>
      <ambientLight />
    </>
  );
};

const PongGame: React.FC = () => {
  useThree(({ camera }) => {
    camera.position.set(0, 0, 183);
  });

  const initialGameState = getInitialGameState();
  useGameEvents();
  const { paddleLeftRef, paddleRightRef, ballRef } = useGameLoop();
  const scoreLabel = useScoreLabel();

  return (
    <>
      <OrthographicCamera />
      <Light />
      <mesh>
        <Board />
        <DashedLine />
        <Score score={scoreLabel} />
        <Ball ballRef={ballRef} initialPos={initialGameState.ball.pos} />
        <Paddle paddleRef={paddleLeftRef} initialPos={initialGameState.paddleLeft.pos} />
        <Paddle paddleRef={paddleRightRef} initialPos={initialGameState.paddleRight.pos} />
      </mesh>
      <OrbitControls />
      <axesHelper args={[GAME_WIDTH]} />
    </>
  );
};

const Loading: React.FC = () => {
  return <h2>Loading...</h2>;
};

const _Pong2D: React.FC = () => {
  const gameContext = useContext(GameContext);
  if (gameContext === undefined) {
    throw new Error("Undefined GameContext");
  }
  const { gameMode }: GameProps = gameContext;
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
