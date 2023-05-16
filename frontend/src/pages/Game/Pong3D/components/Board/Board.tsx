import React from "react";
import { TextureLoader, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

import { GAME_WIDTH, GAME_HEIGHT, PADDLE_DEPTH } from "@Game/pongCore/constants";
import { BOARD_3D_Z } from "@Game/constants";

// export const Board: React.FC = () => {
//   const matcapTexture = useLoader(TextureLoader, "space.jpeg");

//   return (
//     <mesh position={new Vector3(0, 0, BOARD_3D_Z)} visible castShadow>
//       <boxGeometry attach="geometry" args={[GAME_WIDTH, GAME_HEIGHT, GAME_DEPTH]} />
//       <meshMatcapMaterial matcap={matcapTexture} side={THREE.DoubleSide} />
//     </mesh>
//   );
// };

export const Board: React.FC = () => {
  return (
    <>
      <mesh position={new Vector3(0, GAME_HEIGHT / 2 + 10, 0)} visible castShadow>
        <boxGeometry args={[GAME_WIDTH, 20, PADDLE_DEPTH]} />
        <meshStandardMaterial color={"white"} />
      </mesh>
      <mesh position={new Vector3(0, -GAME_HEIGHT / 2 - 10, 0)} visible castShadow>
        <boxGeometry args={[GAME_WIDTH, 20, PADDLE_DEPTH]} />
        <meshStandardMaterial color={"white"} />
      </mesh>
    </>
  );
};
