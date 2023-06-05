<<<<<<< HEAD
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
=======
import React, { useContext } from "react";
import "./Quit.css";

import { SocketContext } from "../../../../../contexts";
import { ClientEvents, type LobbyMode } from "../../../@types";
import { GameContext } from "../../../context";

interface QuitProps {
  setQuitButton: React.Dispatch<React.SetStateAction<boolean>>;
>>>>>>> master
  setQuitGame: React.Dispatch<React.SetStateAction<boolean>>;
  setLobbyMode: React.Dispatch<React.SetStateAction<LobbyMode | undefined>>;
}

<<<<<<< HEAD
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
=======
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
>>>>>>> master
  };

  return (
    <div className="game-modal">
      <div className="quit-text">Do you wish to leave the current game ?</div>
<<<<<<< HEAD
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
=======
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
>>>>>>> master
      </div>
    </div>
  );
};
