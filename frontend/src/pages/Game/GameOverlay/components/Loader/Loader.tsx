import React from "react";

import "./Loader.css";
<<<<<<< HEAD
import { CloseButton } from "../CloseButton";
=======
>>>>>>> master

interface LoaderParameters {
  loader: boolean;
}

export const Loader: React.FC<LoaderParameters> = ({ loader }) => {
  if (!loader) {
    return null;
  }

  return (
<<<<<<< HEAD
    <div className="game-modal-cross">
      <CloseButton />
=======
    <div className="game-modal loader-modal">
>>>>>>> master
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
