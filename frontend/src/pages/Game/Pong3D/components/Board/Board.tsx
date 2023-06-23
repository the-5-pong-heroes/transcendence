import React from "react";
import { BackSide, TextureLoader, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";
import { GAME_WIDTH, GAME_HEIGHT, PADDLE_DEPTH, GAME_DEPTH } from "@shared/pongCore/constants";

import { SkyMap, SpaceMap } from "@/assets";
import { useTheme } from "@/hooks";

interface BoxProps {
  posY: number;
}

const BoardBox: React.FC<BoxProps> = ({ posY }: BoxProps) => {
  return (
    <mesh position={new Vector3(0, posY, 0)} visible castShadow>
      <boxGeometry args={[GAME_WIDTH, 20, PADDLE_DEPTH + 10]} />
      <meshStandardMaterial color={"white"} transparent={true} opacity={0.5} />
    </mesh>
  );
};

export const Board: React.FC = () => {
  const theme = useTheme();
  const textureLight = useLoader(TextureLoader, SkyMap);
  const textureDark = useLoader(TextureLoader, SpaceMap);
  const texture = theme === "dark" ? textureDark : textureLight;

  return (
    <mesh position={new Vector3(0, 0, 0)} visible castShadow>
      {/* <boxGeometry args={[GAME_WIDTH, GAME_HEIGHT, GAME_DEPTH]} /> */}
      <sphereGeometry args={[GAME_DEPTH]} />
      <meshBasicMaterial attach="material" map={texture} side={BackSide} />
      {/* <BoardBox posY={GAME_HEIGHT / 2 + 10} />
      <BoardBox posY={-GAME_HEIGHT / 2 - 10} /> */}
    </mesh>
  );
};
