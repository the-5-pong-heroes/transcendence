/* eslint-disable no-magic-numbers */

import React from "react";
import * as THREE from "three";

import { GAME_HEIGHT } from "../../../constants";

export const DashedLine: React.FC = () => {
  const lineWidth = 100;
  const vertices = new THREE.BufferAttribute(
    new Float32Array([0, GAME_HEIGHT / 2, -128.5, 0, -GAME_HEIGHT / 2, -128.5]),
    3
  );

  return (
    <line>
      <bufferGeometry attributes={{ position: vertices }} />
      <lineBasicMaterial linewidth={lineWidth} color={"white"} />
    </line>
  );
};
