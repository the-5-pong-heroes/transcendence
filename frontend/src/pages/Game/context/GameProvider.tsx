import React, { useMemo, useRef, useState, useEffect } from "react";
import { Pong } from "@shared/pongCore";

<<<<<<< HEAD
import type { GameMode, PaddleSide, ServerPong, GameContextParameters, LobbyState } from "../@types";
import { ClientEvents } from "../@types";
=======
import { Pong } from "../pongCore";
import type { PlayState, GameMode, PaddleSide, ServerPong } from "../@types";
>>>>>>> master
import { type GameOverlayRef } from "../GameOverlay";
import { useGameSize, usePause, useGameList } from "../hooks";

import { GameContext } from "./GameContext";

<<<<<<< HEAD
import type { SocketParameters, GameState } from "@types";
import { useAppContext, useSocketContext } from "@hooks";
=======
interface ContextParameters {
  height: number;
  width: number;
  overlayRef: React.RefObject<GameOverlayRef> | undefined;
  playRef: React.MutableRefObject<PlayState>;
  gameMode: GameMode | undefined;
  setGameMode: (mode: GameMode | undefined) => void;
  localPongRef: React.MutableRefObject<Pong>;
  serverPongRef: React.MutableRefObject<ServerPong | undefined>;
  paddleSideRef: React.MutableRefObject<PaddleSide>;
}
>>>>>>> master

interface ProviderParameters {
  children: React.ReactNode;
}

export const GameProvider: React.FC<ProviderParameters> = ({ children }) => {
  const { height, width } = useGameSize();
<<<<<<< HEAD
  const lobbyRef = useRef<LobbyState>();
  const overlayRef = useRef<GameOverlayRef>(null);
  const { playRef } = usePause({ overlayRef });
  const [gameMode, setGameMode] = useState<GameMode | undefined>(undefined);
  const paddleSideRef = useRef<PaddleSide | undefined>(undefined);
=======
  const { playRef } = usePause({ overlayRef });
  const [gameMode, setGameMode] = useState<GameMode | undefined>(undefined);
  const paddleSideRef = useRef<PaddleSide>("right");
>>>>>>> master
  const localPongRef = useRef<Pong>(new Pong());
  const serverPongRef = useRef<ServerPong>();
  const { gameList } = useGameList();

  const { socket }: SocketParameters = useSocketContext();
  const { quitGame, setQuitGame }: GameState = useAppContext().gameState;

  const isMounted = useRef<boolean>(false);

  useEffect(() => {
    if (quitGame) {
      overlayRef?.current?.showQuitModal();
      setQuitGame(false);
    }
  }, [quitGame, setQuitGame, socket, playRef]);

  useEffect(() => {
    isMounted.current = true;
    socket?.emit(ClientEvents.GameConnect);

    return () => {
      // socket?.emit(ClientEvents.LobbyLeave);
      isMounted.current = false;
      socket?.emit(ClientEvents.GameDisconnect);
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
