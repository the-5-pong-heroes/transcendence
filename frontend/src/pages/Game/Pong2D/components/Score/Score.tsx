import React from "react";
import { Text } from "@react-three/drei";

interface ScoreProps {
  h: number;
  w: number;
  d: number;
  score: string;
}

export const Score: React.FC<ScoreProps> = ({ w, h, d, score }) => {
  const posZ = -128;

  return (
    <Text position={[0, h / 3, posZ]} fontSize={w / 8} color="white" anchorX="center" characters="0123456789">
      {score}
    </Text>
  );
};
