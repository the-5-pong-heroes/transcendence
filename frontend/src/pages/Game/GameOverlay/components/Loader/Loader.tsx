import React from "react";

import "./Loader.css";
import { CloseButton } from "../CloseButton";

interface LoaderParameters {
  loader: boolean;
}

export const Loader: React.FC<LoaderParameters> = ({ loader }) => {
  if (!loader) {
    return null;
  }

  return (
    <div className="game-modal">
      <CloseButton />
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
