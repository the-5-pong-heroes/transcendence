import React from "react";
import { Vector3 } from "three";

interface PaddleProps {
  paddleRef: React.RefObject<THREE.Mesh>;
  initialPosition: { x: number | undefined; y: number | undefined; z: number | undefined };
  w: number;
  h: number;
  d: number;
}

export const Paddle: React.FC<PaddleProps> = ({ paddleRef, initialPosition: { x = 0, y = 0, z = 0 }, w, h, d }) => {
  return (
    <mesh ref={paddleRef} position={new Vector3(x, y, z)}>
      <planeGeometry attach="geometry" args={[w, h]} />
      <meshBasicMaterial attach="material" color="white" />
    </mesh>
  );
};
