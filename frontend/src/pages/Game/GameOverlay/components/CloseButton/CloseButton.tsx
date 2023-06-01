import React from "react";
import "./CloseButton.css";

import { type GameContextParameters } from "@Game/@types";
import { useGameContext } from "@Game/hooks";

export const CloseButton: React.FC = () => {
  const { overlayRef }: GameContextParameters = useGameContext();

  return (
    <div className="close-button-wrapper" onClick={() => overlayRef?.current?.resetGame()}>
      <button className="close-button"></button>
    </div>
  );
};
