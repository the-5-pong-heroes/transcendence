import React from "react";
import * as PIXI from "pixi.js";
import { Sprite } from "react-pixi-fiber/index.js";

interface LineProps {
  height: number;
  width: number;
}

export const DashedLine: React.FC<LineProps> = ({ height, width }) => {
  return (
    <Sprite
      height={height}
      width={width * 0.01}
      x={width / 2}
      y={height / 2}
      anchor={0.5}
      texture={PIXI.Texture.WHITE}
      zIndex={9}
    />
  );
};
