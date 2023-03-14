import React from "react";

interface PlayProps {
  play: boolean;
  setPlay(arg0: React.SetStateAction<boolean>): void;
}

export const PlayButton: React.FC<PlayProps> = ({ play, setPlay }) => {
  if (play) {
    return null;
  }

  return (
    <div className="button-wrapper">
      <button
        className="button"
        onClick={() => {
          setPlay(true);
        }}>
        PLAY
      </button>
    </div>
  );
};
