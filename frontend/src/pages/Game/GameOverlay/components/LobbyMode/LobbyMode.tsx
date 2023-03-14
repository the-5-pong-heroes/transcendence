import React, { useContext } from "react";
import "./LobbyMode.css";

import { SocketContext } from "../../../../../contexts";
import { ClientEvents, type GameMode, type LobbyMode } from "../../../@types";

interface LobbyModeProps {
  gameMode: GameMode | undefined;
  lobbyMode: LobbyMode | undefined;
  setLobbyMode: React.Dispatch<React.SetStateAction<LobbyMode | undefined>>;
}

export const LobbyModeButton: React.FC<LobbyModeProps> = ({ gameMode, lobbyMode, setLobbyMode }) => {
  const { socketRef } = useContext(SocketContext);

  if (lobbyMode) {
    return null;
  }

  const handleSendEvent = (lobbyMode: LobbyMode): void => {
    setLobbyMode(lobbyMode);
    socketRef.current?.emit(ClientEvents.LobbyJoin, { lobbyMode: lobbyMode, gameMode: gameMode });
  };

  return (
    <div className="modal-lobby">
      <div className="button-wrapper">
        <button
          className="button-lobby"
          onClick={() => {
            handleSendEvent("solo");
          }}>
          ONE PLAYER
        </button>
        <button
          className="button-lobby"
          onClick={() => {
            handleSendEvent("duo");
          }}>
          TWO PLAYER
        </button>
      </div>
    </div>
  );
};
