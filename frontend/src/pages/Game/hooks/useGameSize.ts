import { useEffect, useState } from "react";

const WIDTH_RATIO = 0.8;
const HEIGHT_RATIO = 0.8;
// const ASPECT_RATIO = 4 / 3;
const ASPECT_RATIO = 1.56;

const computeGameWidth = (): number => {
  const widthFromHeight = Math.floor(ASPECT_RATIO * HEIGHT_RATIO * window.innerHeight);
  const widthFromWidth = Math.floor(WIDTH_RATIO * window.innerWidth);

  return Math.min(widthFromHeight, widthFromWidth);
};

const computeGameHeight = (): number => Math.floor(computeGameWidth() / ASPECT_RATIO);

interface GameSizeValues {
  width: number;
  height: number;
}

export const useGameSize = (): GameSizeValues => {
  const [gameWidth, setGameWidth] = useState<number>(computeGameWidth());
  const [gameHeight, setGameHeight] = useState<number>(computeGameHeight());

  useEffect(() => {
    const handleResize = (): void => {
      setGameWidth(computeGameWidth());
      setGameHeight(computeGameHeight());
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { width: gameWidth, height: gameHeight };
};
