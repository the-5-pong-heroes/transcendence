import React, { Suspense, useContext } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";

import "./Pong2D.css";

import { GameContext } from "../context/GameContext";
import type { GameMode } from "../@types";
import {
  BALL_RADIUS,
  GAME_DEPTH,
  GAME_HEIGHT,
  GAME_WIDTH,
  PADDLE_DEPTH,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from "../constants";
import { useGameLoop } from "../hooks";

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

  const { gameRef, paddleLeftRef, paddleRightRef, ballRef, scoreLabel } = useGameLoop();

  return (
    <>
      <OrthographicCamera />
      <Light />
      <mesh>
        <Board w={GAME_WIDTH} h={GAME_HEIGHT} d={GAME_DEPTH} />
        <DashedLine w={GAME_WIDTH} h={GAME_HEIGHT} d={GAME_DEPTH} />
        <Score w={GAME_WIDTH} h={GAME_HEIGHT} d={GAME_DEPTH} score={scoreLabel} />
        <Ball
          ballRef={ballRef}
          initialPosition={{
            x: gameRef.current?.ball.pos.x,
            y: gameRef.current?.ball.pos.y,
            z: gameRef.current?.ball.pos.z,
          }}
          radius={BALL_RADIUS}
        />
        <Paddle
          paddleRef={paddleLeftRef}
          initialPosition={{
            x: gameRef.current?.paddleLeft.pos.x,
            y: gameRef.current?.paddleLeft.pos.y,
            z: gameRef.current?.paddleLeft.pos.z,
          }}
          w={PADDLE_WIDTH}
          h={PADDLE_HEIGHT}
          d={-PADDLE_DEPTH}
        />
        <Paddle
          paddleRef={paddleRightRef}
          initialPosition={{
            x: gameRef.current?.paddleRight.pos.x,
            y: gameRef.current?.paddleRight.pos.y,
            z: gameRef.current?.paddleRight.pos.z,
          }}
          w={PADDLE_WIDTH}
          h={PADDLE_HEIGHT}
          d={-PADDLE_DEPTH}
        />
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
  const { gameMode }: GameProps = useContext(GameContext);
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
