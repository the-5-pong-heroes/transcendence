import React from "react";
import * as PIXI from "pixi.js";
import { Sprite } from "react-pixi-fiber/index.js";

interface BoardProps {
  height: number;
  width: number;
}

export const Board: React.FC<BoardProps> = ({ height, width }) => {
  return <Sprite height={height} width={width} texture={PIXI.Texture.WHITE} tint={0x000000} zIndex={5} />;
};
