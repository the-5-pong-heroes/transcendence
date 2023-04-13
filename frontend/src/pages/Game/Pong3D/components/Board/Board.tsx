import React from "react";
import { TextureLoader, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

import { GAME_WIDTH, GAME_HEIGHT, GAME_DEPTH } from "../../../pongCore/constants";
import { BOARD_3D_Z } from "../../../constants";

export const Board: React.FC = () => {
  const matcapTexture = useLoader(TextureLoader, "space.jpeg");

  return (
    <mesh position={new Vector3(0, 0, BOARD_3D_Z)} visible castShadow>
      <boxGeometry attach="geometry" args={[GAME_WIDTH, GAME_HEIGHT, GAME_DEPTH]} />
      <meshStandardMaterial color={"black"} opacity={0.1} side={THREE.DoubleSide} />
      {/* <meshMatcapMaterial matcap={matcapTexture} side={THREE.DoubleSide} /> */}
    </mesh>
  );
};
