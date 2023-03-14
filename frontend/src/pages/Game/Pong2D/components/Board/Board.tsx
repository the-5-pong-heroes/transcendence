import React from "react";
import { Vector3 } from "three";

interface BoardProps {
  w: number;
  h: number;
  d: number;
}

export const Board: React.FC<BoardProps> = ({ w, h, d }) => {
  return (
    <mesh visible castShadow position={new Vector3(0, 0, -129)}>
      <planeGeometry attach="geometry" args={[w, h, d]} />
      <meshBasicMaterial attach="material" color={"#000"} />
    </mesh>
  );
};
