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
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error("Undefined SocketContext");
  }
  const { socketRef } = socketContext;

  if (lobbyMode) {
    return null;
  }

  const handleSendEvent = (lobbyMode: LobbyMode): void => {
    setLobbyMode(lobbyMode);
    // socketRef.current?.emit(ClientEvents.LobbyJoin, { lobbyMode: true, gameMode: 3 });
    socketRef.current?.emit(ClientEvents.LobbyJoin, { lobbyMode: lobbyMode, gameMode: gameMode });
  };

  return (
    <div className="game-modal lobby">
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
