import React from "react";
import "./Loader.css";

interface LoaderParameters {
  loader: boolean;
}

export const Loader: React.FC<LoaderParameters> = ({ loader }) => {
  if (!loader) {
    return null;
  }

  return (
    <div className="game-modal loader-modal">
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
