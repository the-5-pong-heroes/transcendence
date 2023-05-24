import React from "react";
import "./LobbyMode.css";

import { ClientEvents, type GameMode, type LobbyMode, type GameContextParameters } from "@Game/@types";
import { useSocketContext } from "@hooks";
import type { SocketParameters } from "@types";
import { useGameContext } from "@Game/hooks";

interface LobbyModeProps {
  gameMode: GameMode | undefined;
  lobbyMode: LobbyMode | undefined;
  setLobbyMode: React.Dispatch<React.SetStateAction<LobbyMode | undefined>>;
}

export const LobbyModeButton: React.FC<LobbyModeProps> = ({ gameMode, lobbyMode, setLobbyMode }) => {
  const { socket }: SocketParameters = useSocketContext();
  const { overlayRef }: GameContextParameters = useGameContext();

  if (lobbyMode) {
    return null;
  }

  const handleSendEvent = (lobbyMode: LobbyMode): void => {
    setLobbyMode(lobbyMode);
    socket?.emit(ClientEvents.LobbyJoin, { lobbyMode: lobbyMode, gameMode: gameMode });
  };

  return (
    <div className="game-modal-cross">
      <div className="close-button-wrapper">
        <button className="close-button" onClick={() => overlayRef?.current?.resetGame()}></button>
      </div>
      <div className="game-button-wrapper">
        <button
          className="game-button"
          onClick={() => {
            handleSendEvent("solo");
          }}>
          ONE PLAYER
        </button>
        <button
          className="game-button"
          onClick={() => {
            handleSendEvent("duo");
          }}>
          TWO PLAYER
        </button>
      </div>
    </div>
  );
};
