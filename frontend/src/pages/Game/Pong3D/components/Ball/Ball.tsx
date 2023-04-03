import React from "react";
import { TextureLoader, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";
import { Vec3 } from "cannon-es";

import { BALL_RADIUS } from "../../../pongCore/constants";

interface BallProps {
  ballRef: React.RefObject<THREE.Mesh>;
  initialPos: Vec3 | undefined;
}

export const Ball: React.FC<BallProps> = ({ ballRef, initialPos = new Vec3(0, 0, 0) }) => {
  const matcapTexture = useLoader(TextureLoader, "/textures/ball_texture.png");

  return (
    <mesh ref={ballRef} position={new Vector3(initialPos.x, initialPos.y, initialPos.z)}>
      <sphereGeometry args={[BALL_RADIUS]} />
      <meshMatcapMaterial matcap={matcapTexture} />
    </mesh>
  );
};
