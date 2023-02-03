import React from "react";
import * as THREE from "three";

interface BoardProps {
  w: number;
  h: number;
  d: number;
}

export const Board: React.FC<BoardProps> = ({ w, h, d }) => {
  return (
    <mesh visible castShadow>
      <boxGeometry attach="geometry" args={[w, h, d]} />
      <meshStandardMaterial color={"#333"} side={THREE.DoubleSide} />
    </mesh>
  );
};
