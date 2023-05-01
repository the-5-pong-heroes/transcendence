/* eslint-disable no-magic-numbers */

import * as THREE from "three";

export const computePositions = (): Float32Array => {
  const count = 500;
  const distance = 50;
  const center = new THREE.Vector3(0, 0, 0);

  const positions = new Float32Array(count * 3);

  const startingPosition = center.clone().add(new THREE.Vector3(distance, 0, 0));
  for (let i = 0; i < count; i++) {
    const theta = THREE.MathUtils.randFloatSpread(360);
    const phi = THREE.MathUtils.randFloatSpread(360);

    const x = distance * Math.sin(theta) * Math.cos(phi);
    const y = distance * Math.sin(theta) * Math.sin(phi);
    const z = distance * Math.cos(theta);

    positions.set(
      [x, y, z].map((v) => v + startingPosition.getComponent(2 - (i % 3))),
      i * 3
    );
    positions.set([x, y, z], i * 3);
  }

  return positions;
};
