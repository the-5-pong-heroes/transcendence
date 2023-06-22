import React from "react";
import { Text } from "@react-three/drei";
import { GAME_WIDTH, GAME_HEIGHT } from "@shared/pongCore/constants";

import { SCORE_3D_Z } from "@Game/constants";

interface ScoreProps {
  score: string;
}

export const Score: React.FC<ScoreProps> = ({ score }) => {
  return (
    <Text
      position={[0, GAME_HEIGHT / 2.7, SCORE_3D_Z]}
      fontSize={GAME_WIDTH / 6}
      color="white"
      anchorX="center"
      characters="0123456789">
      {score}
    </Text>
  );
};
