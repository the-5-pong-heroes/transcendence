import React, { useContext } from "react";
import "./PongMenu.css";

import type { GameMode } from "../@types";
import { GameContext } from "../context/GameContext";

import { GameModeButton } from "./components";

interface GameProps {
  height: number;
  width: number;
  gameMode: GameMode | undefined;
  setGameMode: (mode: GameMode) => void;
}

const _PongMenu: React.FC = () => {
  const { height, width, gameMode, setGameMode }: GameProps = useContext(GameContext);
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
    </div>
  );
};

export const PongMenu = React.memo(_PongMenu);
