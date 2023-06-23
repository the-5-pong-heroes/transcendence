import React from "react";
import { Vector3 } from "three";
import { Vec3 } from "cannon-es";
import { PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_DEPTH } from "@shared/pongCore/constants";

interface PaddleProps {
  paddleRef: React.RefObject<THREE.Mesh>;
  initialPos: Vec3 | undefined;
}

export const Paddle: React.FC<PaddleProps> = ({ paddleRef, initialPos = new Vec3(0, 0, 0) }) => {
  return (
    <mesh ref={paddleRef} position={new Vector3(initialPos.x, initialPos.y, initialPos.z)}>
      <boxGeometry args={[PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_DEPTH]} />
      <meshStandardMaterial color={"white"} transparent={true} opacity={0.8} />
    </mesh>
  );
};
