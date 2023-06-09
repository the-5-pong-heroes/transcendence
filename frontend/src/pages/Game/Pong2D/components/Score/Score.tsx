import React from "react";
import { Text } from "@react-three/drei";
import { GAME_WIDTH, GAME_HEIGHT } from "@shared/pongCore/constants";

interface ScoreProps {
  score: string;
}

export const Score: React.FC<ScoreProps> = ({ score }) => {
  return (
    <Text
      position={[0, GAME_HEIGHT / 3, 0]}
      fontSize={GAME_WIDTH / 8}
      color="white"
      anchorX="center"
      characters="0123456789">
      {score}
    </Text>
  );
};
