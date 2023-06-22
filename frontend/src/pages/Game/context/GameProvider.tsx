import React, { useMemo, useRef, useState, useEffect } from "react";
import { Pong } from "@shared/pongCore";

import type { GameMode, PaddleSide, ServerPong, GameContextParameters, LobbyState } from "../@types";
import { ClientEvents } from "../@types";
import { type GameOverlayRef } from "../GameOverlay";
import { useGameSize, usePause, useGameList } from "../hooks";

import { GameContext } from "./GameContext";

import type { GameState } from "@types";
import { useAppContext, useSocket } from "@hooks";

interface ProviderParameters {
  children: React.ReactNode;
}

export const GameProvider: React.FC<ProviderParameters> = ({ children }) => {
  const { height, width } = useGameSize();
  const lobbyRef = useRef<LobbyState>();
  const overlayRef = useRef<GameOverlayRef>(null);
  const { playRef } = usePause({ overlayRef });
  const [gameMode, setGameMode] = useState<GameMode | undefined>(undefined);
  const paddleSideRef = useRef<PaddleSide | undefined>(undefined);
  const localPongRef = useRef<Pong>(new Pong());
  const serverPongRef = useRef<ServerPong>();
  const { gameList } = useGameList();

  const socket = useSocket();
  const { quitGame, setQuitGame }: GameState = useAppContext().gameState;

  useEffect(() => {
    if (quitGame) {
      overlayRef?.current?.showQuitModal();
      setQuitGame(false);
    }
  }, [quitGame, setQuitGame, socket, playRef]);

  useEffect(() => {
    setTimeout(() => (socket.emit(ClientEvents.GameConnect), 1000));

    return () => {
      // socket.emit(ClientEvents.LobbyLeave);
      socket.emit(ClientEvents.GameDisconnect);
    };
  }, [socket]);

  const gameContext = useMemo(
    (): GameContextParameters => ({
      height,
      width,
      lobbyRef,
      overlayRef,
      playRef,
      gameMode,
      setGameMode,
      paddleSideRef,
      serverPongRef,
      localPongRef,
      gameList,
    }),
    [height, width, overlayRef, playRef, gameMode, setGameMode, localPongRef, paddleSideRef, gameList]
  );

  return <GameContext.Provider value={gameContext}>{children}</GameContext.Provider>;
};
