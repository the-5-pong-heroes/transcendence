import React from "react";

import { GameButton } from "../GameButton";
import { CloseButton } from "../CloseButton";

import { ClientEvents, type GameMode, type LobbyMode } from "@Game/@types";
import { useSocket } from "@hooks";

interface LobbyModeProps {
  gameMode: GameMode | undefined;
  lobbyMode: LobbyMode | undefined;
  setLobbyMode: React.Dispatch<React.SetStateAction<LobbyMode | undefined>>;
}

export const LobbyModeButton: React.FC<LobbyModeProps> = ({ gameMode, lobbyMode, setLobbyMode }) => {
  const socket = useSocket();

  if (lobbyMode) {
    return null;
  }

  const handleSendEvent = (lobbyMode: LobbyMode): void => {
    setLobbyMode(lobbyMode);
    socket.emit(ClientEvents.LobbyJoin, { lobbyMode: lobbyMode, gameMode: gameMode });
  };

  return (
    <div className="game-modal">
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
      </div>
    </div>
  );
};
