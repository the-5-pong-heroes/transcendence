import React, { Suspense, useContext } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import "./Pong3D.css";

import type { GameMode } from "../@types";
import { GAME_DEPTH, GAME_HEIGHT, GAME_WIDTH } from "../constants";
import { useGameLoop, useScoreLabel, useGameEvents } from "../hooks";
import { GameContext } from "../context/GameContext";
import { getInitialGameState } from "../helpers";

import { Ball, Board, Paddle, Score } from "./components";

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
  useThree(({ camera }) => {
    camera.position.set(0, 0, GAME_DEPTH / 2);
  });

  const initialGameState = getInitialGameState();
  useGameEvents();
  const { paddleLeftRef, paddleRightRef, ballRef } = useGameLoop();
  const scoreLabel = useScoreLabel();

  return (
    <>
      <Light />
      <mesh>
        <Board />
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
