import React from "react";

import "./LobbyMode.css";
import { GameButton } from "../GameButton";
import { CloseButton } from "../CloseButton";

import { ClientEvents, type GameMode, type LobbyMode } from "@Game/@types";
import { useSocketContext } from "@hooks";
import type { SocketParameters } from "@types";

interface LobbyModeProps {
  gameMode: GameMode | undefined;
  lobbyMode: LobbyMode | undefined;
  setLobbyMode: React.Dispatch<React.SetStateAction<LobbyMode | undefined>>;
}

export const LobbyModeButton: React.FC<LobbyModeProps> = ({ gameMode, lobbyMode, setLobbyMode }) => {
  const { socket }: SocketParameters = useSocketContext();

  if (lobbyMode) {
    return null;
  }

  const handleSendEvent = (lobbyMode: LobbyMode): void => {
    setLobbyMode(lobbyMode);
<<<<<<< HEAD
    socket?.emit(ClientEvents.LobbyJoin, { lobbyMode: lobbyMode, gameMode: gameMode });
  };

  return (
    <div className="game-modal-cross">
      <CloseButton />
      <div className="game-button-wrapper">
        <GameButton
          text="ONE PLAYER"
          onClick={() => {
            handleSendEvent("solo");
          }}
        />
        <GameButton
          text="TWO PLAYER"
          onClick={() => {
            handleSendEvent("duo");
          }}
        />
        {/* <button
          className="lobby-btn btn-1"
=======
    // socketRef.current?.emit(ClientEvents.LobbyJoin, { lobbyMode: true, gameMode: 3 });
    socketRef.current?.emit(ClientEvents.LobbyJoin, { lobbyMode: lobbyMode, gameMode: gameMode });
  };

  return (
    <div className="game-modal lobby">
      <div className="game-button-wrapper">
        <button
          className="game-button"
>>>>>>> master
          onClick={() => {
            handleSendEvent("solo");
          }}>
          <svg>
            <rect x="0" y="0" fill="none" width="100%" height="100%" rx="20" />
          </svg>
          ONE PLAYER
        </button>
        <button
<<<<<<< HEAD
          className="lobby-btn btn-1"
=======
          className="game-button"
>>>>>>> master
          onClick={() => {
            handleSendEvent("duo");
          }}>
          <svg>
            <rect x="0" y="0" fill="none" width="100%" height="100%" rx="20" />
          </svg>
          TWO PLAYER
        </button> */}
      </div>
    </div>
  );
};
