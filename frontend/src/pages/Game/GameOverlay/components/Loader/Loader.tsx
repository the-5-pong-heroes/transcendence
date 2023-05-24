import React from "react";
import "./Loader.css";

import { type GameContextParameters } from "@Game/@types";
import { useGameContext } from "@Game/hooks";

interface LoaderParameters {
  loader: boolean;
}

export const Loader: React.FC<LoaderParameters> = ({ loader }) => {
  const { overlayRef }: GameContextParameters = useGameContext();

  if (!loader) {
    return null;
  }

  return (
    <div className="game-modal">
      <div className="close-button-wrapper">
        <button className="close-button" onClick={() => overlayRef?.current?.resetGame()}></button>
      </div>
      <div className="loader-wrapper">
        <div className="loader"></div>
        <div className="text">
          Waiting for player
          <span className="jumping-dots">
            <span className="dot-1">.</span>
            <span className="dot-2">.</span>
            <span className="dot-3">.</span>
          </span>
        </div>
      </div>
    </div>
  );
};
