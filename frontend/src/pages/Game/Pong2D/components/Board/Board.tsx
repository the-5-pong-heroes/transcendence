import React from "react";
import { Vector3 } from "three";
import { GAME_WIDTH, GAME_HEIGHT, GAME_DEPTH } from "@shared/pongCore/constants";

import { BOARD_2D_Z } from "@Game/constants";

export const Board: React.FC = () => {
  return (
    <mesh visible castShadow position={new Vector3(0, 0, BOARD_2D_Z)}>
      <planeGeometry attach="geometry" args={[GAME_WIDTH, GAME_HEIGHT, GAME_DEPTH]} />
      <meshBasicMaterial attach="material" color={"#000"} />
    </mesh>
  );
};
