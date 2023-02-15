import React, { Suspense, useContext, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import "./Pong3D.css";

import { GameOverlay, type GameOverlayRef } from "../GameOverlay";
import type { PlayState } from "../@types";
import {
  BALL_RADIUS_RATIO,
  GAME_DEPTH,
  GAME_HEIGHT,
  GAME_WIDTH,
  PADDLE_DEPTH_RATIO,
  PADDLE_HEIGHT_RATIO,
  PADDLE_WIDTH_RATIO,
} from "../constants";
import { useGameLoop } from "../hooks";
import { SocketContext } from "../../../contexts";

import { Ball, Board, Paddle, Score } from "./components";

interface GameProps {
  height: number;
  width: number;
  playRef: React.MutableRefObject<PlayState>;
  overlayRef: React.RefObject<GameOverlayRef>;
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

const PongGame: React.FC<GameProps> = ({ overlayRef }) => {
  useThree(({ camera }) => {
    camera.position.set(0, 0, GAME_DEPTH / 2);
  });

  const { gameRef, paddleLeftRef, paddleRightRef, ballRef, scoreLabel } = useGameLoop({
    overlayRef,
  });

  return (
    <>
      <Light />
      <mesh>
        <Board w={GAME_WIDTH} h={GAME_HEIGHT} d={GAME_DEPTH} />
        <Score w={GAME_WIDTH} h={GAME_HEIGHT} d={GAME_DEPTH} score={scoreLabel} />
        <Ball
          ballRef={ballRef}
          initialPosition={{
            x: gameRef.current?.ball.posX,
            y: gameRef.current?.ball.posY,
            z: gameRef.current?.ball.posZ,
          }}
          radius={GAME_WIDTH * BALL_RADIUS_RATIO}
        />
        <Paddle
          paddleRef={paddleLeftRef}
          initialPosition={{
            x: gameRef.current?.paddleLeft.posX,
            y: gameRef.current?.paddleLeft.posY,
            z: gameRef.current?.paddleLeft.posZ,
          }}
          w={GAME_WIDTH * PADDLE_WIDTH_RATIO}
          h={GAME_HEIGHT * PADDLE_HEIGHT_RATIO}
          d={-GAME_DEPTH * PADDLE_DEPTH_RATIO}
        />
        <Paddle
          paddleRef={paddleRightRef}
          initialPosition={{
            x: gameRef.current?.paddleRight.posX,
            y: gameRef.current?.paddleRight.posY,
            z: gameRef.current?.paddleRight.posZ,
          }}
          w={GAME_WIDTH * PADDLE_WIDTH_RATIO}
          h={GAME_HEIGHT * PADDLE_HEIGHT_RATIO}
          d={-GAME_DEPTH * PADDLE_DEPTH_RATIO}
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

const _Pong3D: React.FC = () => {
  const { height, width, overlayRef, playRef }: GameProps = useOutletContext();
  const { socketRef } = useContext(SocketContext);

  useEffect(() => {
    socketRef.current?.on("open", (message) => {
      setTimeout(() => {
        socketRef.current?.emit("connectGame");
      }, 500);
      console.log("💡💡💡💡", message);
    });
  }, [socketRef]);

  return (
    <div className="canvas-container">
      <GameOverlay ref={overlayRef} height={height} width={width} playRef={playRef} />
      <Suspense fallback={<Loading />}>
        <Canvas>
          <PongGame height={height} width={width} overlayRef={overlayRef} playRef={playRef} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export const Pong3D = React.memo(_Pong3D);
