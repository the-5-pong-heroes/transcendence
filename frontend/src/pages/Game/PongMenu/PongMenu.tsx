import React from "react";
import "./PongMenu.css";

<<<<<<< HEAD
import { type GameContextParameters } from "../@types";
import { useGameContext } from "../hooks";
=======
import type { GameMode } from "../@types";
import { GameContext } from "../context";
>>>>>>> master

import { GameModeButton, ListOfGames } from "./components";

const _PongMenu: React.FC = () => {
  const { height, width, gameMode, setGameMode }: GameContextParameters = useGameContext();

  if (gameMode) {
    return null;
  }

  const containerStyle: React.CSSProperties = {
    height,
    width,
  };

  return (
    <div className="menu-container" style={containerStyle}>
      <GameModeButton setGameMode={setGameMode} />
      <ListOfGames />
    </div>
  );
};

export const PongMenu = React.memo(_PongMenu);
