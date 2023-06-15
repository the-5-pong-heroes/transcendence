import React from "react";
import { TextureLoader, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";
import { GAME_WIDTH, GAME_HEIGHT, PADDLE_DEPTH } from "@shared/pongCore/constants";

interface BoxProps {
  posY: number;
}

const BoardBox: React.FC<BoxProps> = ({ posY }: BoxProps) => {
  return (
    <mesh position={new Vector3(0, posY, 0)} visible castShadow>
      <boxGeometry args={[GAME_WIDTH, 20, PADDLE_DEPTH]} />
      <meshStandardMaterial color={"white"} transparent={true} opacity={0.5} />
    </mesh>
  );
};

export const Board: React.FC = () => {
  return (
    <>
      <BoardBox posY={GAME_HEIGHT / 2 + 10} />
      <BoardBox posY={-GAME_HEIGHT / 2 - 10} />
    </>
  );
};
