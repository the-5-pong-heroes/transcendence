import React, { useContext } from "react";
import "./PlayButton.css";

import { SocketContext } from "../../../../../contexts";
import type { PlayState } from "../../../@types";

interface ButtonProps {
  visible: boolean;
  setVisible(arg0: React.SetStateAction<boolean>): void;
  playRef: React.MutableRefObject<PlayState>;
}

export const PlayButton: React.FC<ButtonProps> = ({ visible, setVisible, playRef }) => {
  const buttonStyle: React.CSSProperties = {
    visibility: visible ? "visible" : "hidden",
  };
  const { socketRef } = useContext(SocketContext);

  const handleSendMessage = (): void => {
    socketRef.current?.emit("startGame");
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
        handleSendMessage();
      }}>
      PLAY
    </button>
  );
};
