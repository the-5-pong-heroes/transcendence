import React from "react";
import { Vector3 } from "three";

interface PaddleProps {
  paddleRef: React.RefObject<THREE.Mesh>;
  initialPosition: { x: number; y: number; z: number };
  w: number;
  h: number;
  d: number;
}

export const Paddle: React.FC<PaddleProps> = ({ paddleRef, initialPosition: { x, y, z }, w, h, d }) => {
  return (
    <mesh ref={paddleRef} position={new Vector3(x, y, z)}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={"white"} />
    </mesh>
  );
};
