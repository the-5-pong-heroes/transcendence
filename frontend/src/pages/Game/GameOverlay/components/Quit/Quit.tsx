import React, { useContext } from "react";
import "./Quit.css";

import { SocketContext } from "../../../../../contexts";
import { ClientEvents, type LobbyMode } from "../../../@types";
import { GameContext } from "../../../context";

interface QuitProps {
  setQuitButton: React.Dispatch<React.SetStateAction<boolean>>;
  setQuitGame: React.Dispatch<React.SetStateAction<boolean>>;
  setLobbyMode: React.Dispatch<React.SetStateAction<LobbyMode | undefined>>;
}

export const QuitButton: React.FC<QuitProps> = ({ setQuitButton, setQuitGame, setLobbyMode }) => {
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error("Undefined SocketContext");
  }
  const { socketRef } = socketContext;

  const gameContext = useContext(GameContext);
  if (gameContext === undefined) {
    throw new Error("Undefined GameContext");
  }
  const { setGameMode } = gameContext;

  const quitGame = (): void => {
    socketRef.current?.emit(ClientEvents.LobbyLeave);
    setGameMode(undefined);
    setLobbyMode(undefined);
    setQuitGame(true);
    setQuitButton(false);
  };

  const resumeGame = (): void => {
    setQuitButton(false);
    socketRef.current?.emit(ClientEvents.GamePause);
  };

  return (
    <div className="game-modal">
      <div className="quit-text">Do you wish to leave the current game ?</div>
      <div className="game-button-wrapper">
        <button
          className="game-button"
          onClick={() => {
            quitGame();
          }}>
          YES
        </button>
        <button
          className="game-button"
          onClick={() => {
            resumeGame();
          }}>
          NO
        </button>
      </div>
    </div>
  );
};
