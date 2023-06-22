import React from "react";
import { TextureLoader, Vector3 } from "three";
import { Vec3 } from "cannon-es";
import { useLoader } from "@react-three/fiber";
import { BALL_RADIUS } from "@shared/pongCore/constants";

interface BallProps {
  ballRef: React.RefObject<THREE.Mesh>;
  initialPos: Vec3 | undefined;
}

export const Ball: React.FC<BallProps> = ({ ballRef, initialPos = new Vec3(0, 0, 0) }) => {
  const base = useLoader(TextureLoader, "moon_map.jpg");
  const normal = useLoader(TextureLoader, "moon_NormalMap.png");

  return (
    <mesh ref={ballRef} position={new Vector3(initialPos.x, initialPos.y, initialPos.z)} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[BALL_RADIUS]} />
      <meshPhysicalMaterial map={base} normalMap={normal} />
    </mesh>
  );
};
