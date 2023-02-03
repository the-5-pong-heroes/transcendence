import React from "react";
import * as PIXI from "pixi.js";
import { Sprite } from "react-pixi-fiber/index.js";

interface PaddleProps {
  h: number;
  w: number;
  x: number;
  y: number;
}

export const Paddle: React.FC<PaddleProps> = ({ h, w, x, y }) => {
  return <Sprite height={h} width={w} x={x} y={y} texture={PIXI.Texture.WHITE} zIndex={10} />;
};
