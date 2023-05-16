import { useContext } from "react";

import type { GameContextParameters } from "../@types";
import { GameContext } from "../context";

export const useGameContext = (): GameContextParameters => {
  const gameContext = useContext(GameContext);
  if (gameContext === undefined) {
    throw new Error("Undefined GameContext");
  }

  return gameContext;
};
