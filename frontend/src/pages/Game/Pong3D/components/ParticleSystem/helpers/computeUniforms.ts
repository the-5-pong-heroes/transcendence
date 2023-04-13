/* eslint-disable no-magic-numbers */

import * as THREE from "three";

interface UniformsObject {
  uTime: { value: number };
  uRadius: { value: number };
  [uniform: string]: THREE.IUniform;
}

export const computeUniforms = (): UniformsObject => {
  const count = 500;
  const radius = 200;
  const center = new THREE.Vector3(0, 0, 0);

  return {
    uTime: {
      value: 0.0,
    },
    uRadius: {
      value: radius,
    },
    uBallPosition: {
      value: center.toArray(),
    },
    uSpeed: {
      value: [...new Array<number>(count)].map(() => THREE.MathUtils.randFloat(0.1, 0.5)),
    },
  };
};
