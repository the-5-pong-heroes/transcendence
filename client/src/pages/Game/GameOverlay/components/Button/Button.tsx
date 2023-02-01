import React from "react";

import "./Button.css";

import type { PlayState } from "../../../Pong2D/@types";

interface ButtonProps {
  visible: boolean;
  setVisible(arg0: React.SetStateAction<boolean>): void;
  playRef: React.MutableRefObject<PlayState>;
}

export const Button: React.FC<ButtonProps> = ({ visible, setVisible, playRef }) => {
  const buttonStyle: React.CSSProperties = {
    visibility: visible ? "visible" : "hidden",
  };

  return (
    <button
      className="button"
      role="button"
      style={buttonStyle}
      onClick={() => {
        console.log("Button clicked");
        playRef.current.started = true;
        playRef.current.paused = false;
        setVisible(false);
      }}>
      PLAY
    </button>
  );
};
