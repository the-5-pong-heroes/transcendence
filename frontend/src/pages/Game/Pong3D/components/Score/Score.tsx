import React from "react";
import { Text } from "@react-three/drei";

const OFFSET_Z = 2;

interface ScoreProps {
  h: number;
  w: number;
  d: number;
  score: string;
}

export const Score: React.FC<ScoreProps> = ({ w, h, d, score }) => {
  return (
    <Text
      position={[0, h / 4, -d / 2 + OFFSET_Z]}
      fontSize={w / 4}
      color="white"
      anchorX="center"
      characters="0123456789">
      {score}
    </Text>
  );
};
