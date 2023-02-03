import React from "react";
import { Text } from "react-pixi-fiber/index.js";

interface ScoreProps {
  height: number;
  width: number;
  player1: number;
  player2: number;
}

export const Score: React.FC<ScoreProps> = ({ height, width, player1, player2 }) => {
  const score = `${player1}   ${player2}`;

  return (
    <Text
      text={score}
      //   scale={height / 5}
      x={width / 2}
      y={height / 8}
      style={{ fill: 0xffffff, fontSize: 130 }}
      anchor={0.5}
    />
  );
};
