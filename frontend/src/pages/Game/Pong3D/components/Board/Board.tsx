import React from "react";
import { Vector3 } from "three";
import * as THREE from "three";

import { GAME_WIDTH, GAME_HEIGHT, GAME_DEPTH } from "../../../pongCore/constants";
import { BOARD_3D_Z } from "../../../constants";

export const Board: React.FC = () => {
  return (
    <mesh position={new Vector3(0, 0, BOARD_3D_Z)} visible castShadow>
      <boxGeometry attach="geometry" args={[GAME_WIDTH, GAME_HEIGHT, GAME_DEPTH]} />
      <meshStandardMaterial color={"#333"} side={THREE.DoubleSide} />
    </mesh>
  );
};
