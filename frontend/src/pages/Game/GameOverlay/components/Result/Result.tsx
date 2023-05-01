import React from "react";

import "./Result.css";
import type { LobbyMode, GameResult, GameMode } from "../../../@types";

interface ResultProps {
  result: GameResult | undefined;
  setResult: React.Dispatch<React.SetStateAction<GameResult | undefined>>;
  setLobbyMode: React.Dispatch<React.SetStateAction<LobbyMode | undefined>>;
  setGameMode(arg0: React.SetStateAction<GameMode | undefined>): void;
}

export const Result: React.FC<ResultProps> = ({ result, setResult, setLobbyMode, setGameMode }) => {
  if (!result) {
    return null;
  }

  return (
    <div className="game-modal result-modal">
      <div>
        {result === "Winner" && (
          <>
            <span className="result">You win !</span>
          </>
        )}
        {result === "Loser" && (
          <>
            <span className="result">You lose...</span>
          </>
        )}
        <div className="button-wrapper">
          <button
            className="game-button result-button"
            onClick={() => {
              setLobbyMode(undefined);
              setResult(undefined);
            }}>
            PLAY AGAIN
          </button>
          <button
            className="game-button result-button"
            onClick={() => {
              setResult(undefined);
              setLobbyMode(undefined);
              setGameMode(undefined);
            }}>
            RETURN
          </button>
        </div>
      </div>
    </div>
  );
};
