/* eslint-disable no-magic-numbers */

import React from "react";
import { Vector3 } from "three";

import { GAME_WIDTH, GAME_HEIGHT, GAME_DEPTH } from "../../../constants";

export const Board: React.FC = () => {
  return (
    <mesh visible castShadow position={new Vector3(0, 0, -129)}>
      <planeGeometry attach="geometry" args={[GAME_WIDTH, GAME_HEIGHT, GAME_DEPTH]} />
      <meshBasicMaterial attach="material" color={"#000"} />
    </mesh>
  );
};
