import React from "react";
import { Vector3 } from "three";
// import { TextureLoader } from "three";
// import { useLoader } from "@react-three/fiber";

interface BallProps {
  ballRef: React.RefObject<THREE.Mesh>;
  initialPosition: { x: number | undefined; y: number | undefined; z: number | undefined };
  radius: number;
}

export const Ball: React.FC<BallProps> = ({ ballRef, initialPosition: { x = 0, y = 0, z = 0 }, radius }) => {
  // const texture = useLoader(TextureLoader, "/textures/ball_texture.png");

  return (
    <mesh ref={ballRef} position={new Vector3(x, y, z)}>
      <circleGeometry attach="geometry" args={[radius]} />
      <meshBasicMaterial attach="material" color="white" />
    </mesh>
  );
};
