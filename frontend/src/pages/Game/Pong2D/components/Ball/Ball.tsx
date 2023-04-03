import React from "react";
import { Vector3 } from "three";
import { type Vec3 } from "cannon-es";

import { BALL_RADIUS } from "../../../pongCore/constants";

// import { TextureLoader } from "three";
// import { useLoader } from "@react-three/fiber";

interface BallProps {
  ballRef: React.RefObject<THREE.Mesh>;
  initialPos: Vec3;
}

export const Ball: React.FC<BallProps> = ({ ballRef, initialPos }) => {
  // const texture = useLoader(TextureLoader, "/textures/ball_texture.png");
  // console.log(BALL_RADIUS);

  return (
    <mesh ref={ballRef} position={new Vector3(initialPos.x, initialPos.y, initialPos.z)}>
      {/* <circleGeometry attach="geometry" args={[BALL_RADIUS]} /> */}
      <planeGeometry attach="geometry" args={[BALL_RADIUS, BALL_RADIUS]} />
      <meshBasicMaterial attach="material" color="white" />
    </mesh>
  );
};
