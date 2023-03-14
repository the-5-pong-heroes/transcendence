import React from "react";
import { Vector3 } from "three";
import { Vec3 } from "cannon-es";

// import { TextureLoader } from "three";
// import { useLoader } from "@react-three/fiber";

import { BALL_RADIUS } from "../../../constants";

interface BallProps {
  ballRef: React.RefObject<THREE.Mesh>;
  initialPos: Vec3 | undefined;
}

export const Ball: React.FC<BallProps> = ({ ballRef, initialPos = new Vec3(0, 0, 0) }) => {
  // const texture = useLoader(TextureLoader, "/textures/ball_texture.png");

  return (
    <mesh ref={ballRef} position={new Vector3(initialPos.x, initialPos.y, initialPos.z)}>
      <circleGeometry attach="geometry" args={[BALL_RADIUS]} />
      <meshBasicMaterial attach="material" color="white" />
    </mesh>
  );
};
