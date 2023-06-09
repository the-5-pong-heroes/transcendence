import React from "react";
import { Vector3 } from "three";
import { PADDLE_WIDTH, GAME_HEIGHT } from "@shared/pongCore/constants";

import { BOARD_2D_Z } from "@Game/constants";

interface LineParameters {
  posY: number;
}

const Line: React.FC<LineParameters> = ({ posY }) => {
  return (
    <mesh visible castShadow position={new Vector3(0, posY, BOARD_2D_Z)}>
      <planeGeometry attach="geometry" args={[PADDLE_WIDTH, PADDLE_WIDTH]} />
      <meshBasicMaterial attach="material" color={"#fff"} />
    </mesh>
  );
};

export const DashedLine: React.FC = () => {
  const begin = GAME_HEIGHT / 2 - PADDLE_WIDTH;
  const interval = 2 * PADDLE_WIDTH;
  const linePositions = Array.from({ length: 20 }, (_, index) => begin - interval * index);

  return (
    <>
      {linePositions.map((posY) => (
        <Line key={posY} posY={posY} />
      ))}
    </>
  );
};
