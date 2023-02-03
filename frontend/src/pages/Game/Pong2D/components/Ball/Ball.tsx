import React from "react";
import * as PIXI from "pixi.js";
import { Sprite } from "react-pixi-fiber/index.js";

import img from "../../../../../assets/gold_ball.png";

const TEXTURE = PIXI.Texture.from(img);

interface BallProps {
  r: number;
  x: number;
  y: number;
  rad: number;
}

export const Ball: React.FC<BallProps> = ({ r, x, y, rad }) => {
  return <Sprite height={2 * r} width={2 * r} x={x} y={y} rotation={rad} anchor={0.5} texture={TEXTURE} zIndex={10} />;
};
