import React, { useImperativeHandle, useState } from "react";

import type { PlayState } from "../Pong2D/@types";

import type { GameOverlayRef, ScoreState } from "./@types";
import { Score, Button } from "./components";

import "./GameOverlay.css";

interface GameOverlayProps {
  height: number;
  width: number;
  playRef: React.MutableRefObject<PlayState>;
}

const _GameOverlay: React.ForwardRefRenderFunction<GameOverlayRef, GameOverlayProps> = (
  { height, width, playRef },
  overlayRef
) => {
  const containerStyle: React.CSSProperties = {
    height,
    width,
  };

  const [score, setScore] = useState<ScoreState>({ player1: 0, player2: 0 });
  const [visible, setVisible] = useState<boolean>(true);

  useImperativeHandle(overlayRef, () => ({
    showScore: ({ player1, player2 }: ScoreState) => {
      // console.log(player1, " - ", player2);
      setScore({ player1, player2 });
    },
    resetGame: () => {
      setScore({ player1: 0, player2: 0 });
      setVisible(true);
    },
  }));

  return (
    <div className="overlay" style={containerStyle}>
      {/* <Score score={score} /> */}
      <Button visible={visible} setVisible={setVisible} playRef={playRef} />
    </div>
  );
};

export const GameOverlay = React.forwardRef(_GameOverlay);
