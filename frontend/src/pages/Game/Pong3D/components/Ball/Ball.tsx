import React from "react";
import { TextureLoader, Vector3 } from "three";
import { Vec3 } from "cannon-es";
import { Trail } from "@react-three/drei";
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
    <Trail
      width={100} // Width of the line
      color={"white"} // Color of the line
      length={1} // Length of the line
      decay={1} // How fast the line fades away
      local={false} // Wether to use the target's world or local positions
      stride={0} // Min distance between previous and current point
      interval={1} // Number of frames to wait before next calculation
      target={undefined} // Optional target. This object will produce the trail.
      attenuation={(width) => width} // A function to define the width in each point along it.
    >
      <mesh ref={ballRef} position={new Vector3(initialPos.x, initialPos.y, initialPos.z)} rotation={[0, 0, 0]}>
        <sphereGeometry attach="geometry" args={[BALL_RADIUS]} />
        <meshPhysicalMaterial map={base} normalMap={normal} />
      </mesh>
    </Trail>
  );
};
