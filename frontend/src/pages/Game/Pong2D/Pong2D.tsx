import React from "react";
import { Stage } from "react-pixi-fiber/index.js";
import { useOutletContext } from "react-router-dom";

import { GameOverlay, type GameOverlayRef } from "../GameOverlay";

import type { PlayState } from "./@types";
import { useGameLoop } from "./hooks";
import { Ball, Board, Paddle, DashedLine, Score } from "./components";

interface GameProps {
  height: number;
  width: number;
  overlayRef: React.RefObject<GameOverlayRef>;
  playRef: React.MutableRefObject<PlayState>;
}

const PongGame: React.FC<GameProps> = ({ height, width, overlayRef, playRef }) => {
  const { ball, paddleLeft, paddleRight, score } = useGameLoop({ height, width, playRef, overlayRef });

  console.log(height, width);

  return (
    <>
      <Board height={height} width={width} />
      <Score height={height} width={width} player1={score.player1} player2={score.player2} />
      <DashedLine height={height} width={width} />
      <Paddle h={paddleLeft.height} w={paddleLeft.width} x={paddleLeft.posX} y={paddleLeft.posY} />
      <Paddle h={paddleRight.height} w={paddleRight.width} x={paddleRight.posX} y={paddleRight.posY} />
      <Ball r={ball.radius} x={ball.posX} y={ball.posY} rad={ball.rot} />
    </>
  );
};

const _Pong2D: React.FC = () => {
  const { height, width, overlayRef, playRef }: GameProps = useOutletContext();

  return (
    <div>
      <GameOverlay ref={overlayRef} height={height} width={width} playRef={playRef} />
      <Stage options={{ height, width }}>
        <PongGame height={height} width={width} overlayRef={overlayRef} playRef={playRef} />
      </Stage>
    </div>
  );
};

export const Pong2D = React.memo(_Pong2D);
