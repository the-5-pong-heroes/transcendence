import React from "react";
import { Vector3 } from "three";
import { type Vec3 } from "cannon-es";
import { PADDLE_WIDTH, PADDLE_HEIGHT } from "@shared/pongCore/constants";

interface PaddleProps {
  paddleRef: React.RefObject<THREE.Mesh>;
  initialPos: Vec3;
}

export const Paddle: React.FC<PaddleProps> = ({ paddleRef, initialPos }) => {
  return (
    <mesh ref={paddleRef} position={new Vector3(initialPos.x, initialPos.y, initialPos.z)}>
      <planeGeometry attach="geometry" args={[PADDLE_WIDTH, PADDLE_HEIGHT]} />
      <meshBasicMaterial attach="material" color="white" />
    </mesh>
  );
};
