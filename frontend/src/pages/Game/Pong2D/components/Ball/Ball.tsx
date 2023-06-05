import React from "react";
import { Vector3 } from "three";
import { type Vec3 } from "cannon-es";
import { BALL_RADIUS } from "@shared/pongCore/constants";

interface BallProps {
  ballRef: React.RefObject<THREE.Mesh>;
  initialPos: Vec3;
}

export const Ball: React.FC<BallProps> = ({ ballRef, initialPos }) => {
  return (
    <mesh ref={ballRef} position={new Vector3(initialPos.x, initialPos.y, initialPos.z)} rotation={[0, 0, 0]}>
      <planeGeometry attach="geometry" args={[BALL_RADIUS, BALL_RADIUS]} />
      <meshBasicMaterial attach="material" color="white" />
    </mesh>
  );
};
