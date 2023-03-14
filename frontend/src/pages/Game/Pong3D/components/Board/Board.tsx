import React from "react";
import * as THREE from "three";

import { GAME_WIDTH, GAME_HEIGHT, GAME_DEPTH } from "../../../constants";

export const Board: React.FC = () => {
  return (
    <mesh visible castShadow>
      <boxGeometry attach="geometry" args={[GAME_WIDTH, GAME_HEIGHT, GAME_DEPTH]} />
      <meshStandardMaterial color={"#333"} side={THREE.DoubleSide} />
    </mesh>
  );
};
