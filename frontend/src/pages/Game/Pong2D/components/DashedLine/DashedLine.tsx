import React, { useRef } from "react";
import * as THREE from "three";

interface LineProps {
  w: number;
  h: number;
  d: number;
}

export const DashedLine: React.FC<LineProps> = ({ w, h, d }) => {
  const lineWidth = 100;
  const dashSize = 100;
  const gapSize = 100;
  const vertices = new THREE.BufferAttribute(new Float32Array([0, h / 2, -128.5, 0, -h / 2, -128.5]), 3);
  const ref = useRef<THREE.Line>();

  return (
    <line>
      <bufferGeometry attributes={{ position: vertices }} />
      <lineBasicMaterial linewidth={lineWidth} color={"white"} />
    </line>
  );
};
