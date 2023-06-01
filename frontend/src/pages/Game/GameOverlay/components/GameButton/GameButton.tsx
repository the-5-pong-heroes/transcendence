import React from "react";
import "./GameButton.css";

interface GameButtonProps {
  text: string;
  onClick: () => void;
}

export const GameButton: React.FC<GameButtonProps> = ({ text, onClick }) => {
  return (
    <button className="game-btn btn-effect" onClick={onClick}>
      <svg>
        <rect x="0" y="0" fill="none" width="100%" height="100%" rx="10" />
      </svg>
      {text}
    </button>
  );
};
