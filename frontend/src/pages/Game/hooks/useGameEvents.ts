import { useEffect, useContext } from "react";

import type { Pong } from "../pongCore";
import { GameContext } from "../context";
import type { GameOverlayRef } from "../GameOverlay";
import type { PaddleMove, LobbyState, PlayState, GameResult, PaddleSide, ServerPong, PongState } from "../@types";
import { ServerEvents } from "../@types";
import { SocketContext } from "../../../contexts";

interface PaddleUpdateParameters {
  side: PaddleSide;
  move: PaddleMove;
}

interface GameEventsParameters {
  overlayRef: React.RefObject<GameOverlayRef> | undefined;
  playRef: React.MutableRefObject<PlayState>;
  localPongRef: React.MutableRefObject<Pong>;
  paddleSideRef: React.MutableRefObject<PaddleSide>;
  serverPongRef: React.MutableRefObject<ServerPong | undefined>;
}

export const useGameEvents = (): void => {
  const gameContext = useContext(GameContext);
  if (gameContext === undefined) {
    throw new Error("Undefined GameContext");
  }
  const { overlayRef, playRef, localPongRef, paddleSideRef, serverPongRef }: GameEventsParameters = gameContext;

  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error("Undefined SocketContext");
  }
  const { socketRef } = socketContext;

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    const handleLobbyState = (lobby: LobbyState): void => {
      if (lobby.status === "waiting") {
        overlayRef?.current?.showLoader(true);
      } else {
        overlayRef?.current?.showLoader(false);
      }
    };

    const initGame = (side: PaddleSide): void => {
      paddleSideRef.current = side;
    };

    const setPlay = (): void => {
      // console.log("setPlay", Date.now());
      playRef.current.started = true;
      playRef.current.paused = false;
    };

    let timeoutId: number | undefined;
    const startGame = (time: number): void => {
      overlayRef?.current?.showCountdown();
      const currentTime = Date.now();
      const timeUntilTarget = time - currentTime;
      timeoutId = setTimeout(setPlay, timeUntilTarget);
    };

    const updateGame = (serverPong: PongState): void => {
      const lastUpdate = serverPongRef.current ? serverPongRef.current.timestamp : Date.now() - 500;
      serverPongRef.current = {
        pong: serverPong,
        evaluated: false,
        timestamp: Date.now(),
        lastElapsedMs: Date.now() - lastUpdate,
      };
    };

    const endGame = (result: GameResult): void => {
      if (playRef.current) {
        playRef.current.started = false;
        playRef.current.paused = true;
      }
      overlayRef?.current?.setResult(result);
      localPongRef.current.initRound(0);
    };

    const updateOpponentPaddle = (paddle: PaddleUpdateParameters): void => {
      const { side, move } = paddle;
      localPongRef.current.updatePaddleVelocity(side, move);
    };

    const updatePlayState = (play: PlayState): void => {
      if (playRef.current) {
        playRef.current.started = play.started;
        playRef.current.paused = play.paused;
      }
    };

    socket.on(ServerEvents.LobbyState, handleLobbyState);
    socket.on(ServerEvents.GameInit, initGame);
    socket.on(ServerEvents.GameStart, startGame);
    socket.on(ServerEvents.GameUpdate, updateGame);
    socket.on(ServerEvents.PlayUpdate, updatePlayState);
    socket.on(ServerEvents.PaddleUpdate, updateOpponentPaddle);
    socket.on(ServerEvents.GameEnd, endGame);

    return (): void => {
      socket.off(ServerEvents.LobbyState);
      socket.off(ServerEvents.GameInit);
      socket.off(ServerEvents.GameStart);
      socket.off(ServerEvents.GameUpdate);
      socket.off(ServerEvents.PlayUpdate);
      socket.off(ServerEvents.PaddleUpdate);
      socket.off(ServerEvents.GameEnd);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [socketRef, paddleSideRef, playRef, overlayRef, localPongRef, serverPongRef]);
};
