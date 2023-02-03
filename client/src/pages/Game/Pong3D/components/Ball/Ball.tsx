import React from "react";
import { TextureLoader, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";

interface BallProps {
  ballRef: React.RefObject<THREE.Mesh>;
  initialPosition: { x: number; y: number; z: number };
  radius: number;
}

export const Ball: React.FC<BallProps> = ({ ballRef, initialPosition: { x, y, z }, radius }) => {
  const matcapTexture = useLoader(TextureLoader, "/textures/ball_texture.png");

  return (
    <mesh ref={ballRef} position={new Vector3(x, y, z)}>
      <sphereGeometry args={[radius]} />
      <meshMatcapMaterial matcap={matcapTexture} />
    </mesh>
  );
};
