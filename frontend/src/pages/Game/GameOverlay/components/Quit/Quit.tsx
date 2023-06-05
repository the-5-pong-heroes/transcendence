import React from "react";
import { useNavigate } from "react-router-dom";

import "./Quit.css";
import { GameButton } from "../GameButton";

import { useGameContext } from "@Game/hooks";
import type { LobbyMode, GameContextParameters } from "@Game/@types";
import { useAppContext } from "@hooks";
import type { GameState } from "@types";

interface QuitProps {
  setQuitModal: React.Dispatch<React.SetStateAction<boolean>>;
  setQuitGame: React.Dispatch<React.SetStateAction<boolean>>;
  setLobbyMode: React.Dispatch<React.SetStateAction<LobbyMode | undefined>>;
}

export const QuitModal: React.FC<QuitProps> = ({ setQuitModal }) => {
  const { overlayRef }: GameContextParameters = useGameContext();
  const { newRoute }: GameState = useAppContext().gameState;

  const navigate = useNavigate();

  const quitGame = (): void => {
    overlayRef?.current?.resetGame();
    navigate(newRoute.current);
  };

  const resumeGame = (): void => {
    setQuitModal(false);
    overlayRef?.current?.pauseGame();
  };

  return (
    <div className="game-modal">
      <div className="quit-text">Do you wish to leave the current game ?</div>
      <div className="game-button-wrapper-text">
        <GameButton
          text="CONFIRM"
          onClick={() => {
            quitGame();
          }}
        />
        <GameButton
          text="CANCEL"
          onClick={() => {
            resumeGame();
          }}
        />
      </div>
    </div>
  );
};
