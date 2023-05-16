import React from "react";

import { type GameContextParameters } from "@Game/@types";
import { useGameContext } from "@Game/hooks";
import "./Players.css";

export const Players: React.FC = () => {
  const { lobbyRef }: GameContextParameters = useGameContext();

  return (
    <div className="game-players-container">
      <div className="game-players">
        <p>{lobbyRef.current?.userLeft}</p>
        <p>{lobbyRef.current?.userRight}</p>
      </div>
    </div>
  );
};
