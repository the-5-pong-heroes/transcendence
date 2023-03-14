import React from "react";
import { Text } from "@react-three/drei";

import { GAME_WIDTH, GAME_HEIGHT, GAME_DEPTH, OFFSET_Z } from "../../../constants";

interface ScoreProps {
  score: string;
}

export const Score: React.FC<ScoreProps> = ({ score }) => {
  return (
    <Text
      position={[0, GAME_HEIGHT / 3, -GAME_DEPTH / 2 + OFFSET_Z]}
      fontSize={GAME_WIDTH / 4}
      color="white"
      anchorX="center"
      characters="0123456789">
      {score}
    </Text>
  );
};
