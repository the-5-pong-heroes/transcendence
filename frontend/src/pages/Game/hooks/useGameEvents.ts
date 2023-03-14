import { useEffect, useCallback, useContext } from "react";
import type { Pong } from "shared/pongCore";

import { GameContext } from "../context";
import type { GameOverlayRef } from "../GameOverlay";
import type { PaddleMove, LobbyState, PlayState, GameResult, PaddleSide } from "../@types";
import { ServerEvents } from "../@types";
import { SocketContext } from "../../../contexts";
// import type { Pong } from "../pongCore";

interface PaddleUpdateParameters {
  side: PaddleSide;
  move: PaddleMove;
}

interface GameEventsParameters {
  overlayRef: React.RefObject<GameOverlayRef> | undefined;
  playRef: React.MutableRefObject<PlayState>;
  localPongRef: React.MutableRefObject<Pong>;
  paddleSideRef: React.MutableRefObject<PaddleSide>;
}

export const useGameEvents = (): void => {
  const gameContext = useContext(GameContext);
  if (gameContext === undefined) {
    throw new Error("Undefined GameContext");
  }
  const { overlayRef, playRef, localPongRef, paddleSideRef }: GameEventsParameters = gameContext;

  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error("Undefined SocketContext");
  }
  const { socketRef } = socketContext;

  const initGame = useCallback(
    (side: PaddleSide) => {
      paddleSideRef.current = side;
    },
    [paddleSideRef]
  );

  const endGame = useCallback(
    (result: GameResult) => {
      if (playRef.current) {
        playRef.current.started = false;
        playRef.current.paused = true;
      }
      overlayRef?.current?.setResult(result);
      localPongRef.current.initRound(0);
    },
    [playRef, overlayRef, localPongRef]
  );

  const handleLobbyState = useCallback(
    (lobby: LobbyState) => {
      if (lobby.status === "waiting") {
        overlayRef?.current?.showLoader(true);
      } else {
        overlayRef?.current?.showLoader(false);
      }
    },
    [overlayRef]
  );

  const updateOpponentPaddle = useCallback(
    (paddle: PaddleUpdateParameters) => {
      const { side, move } = paddle;
      localPongRef.current.updatePaddleVelocity(side, move);
    },
    [localPongRef]
  );

  const updatePlayState = useCallback(
    (play: PlayState) => {
      if (playRef.current) {
        playRef.current.started = play.started;
        playRef.current.paused = play.paused;
      }
    },
    [playRef]
  );

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    socket.on(ServerEvents.LobbyState, handleLobbyState);
    socket.on(ServerEvents.GameInit, initGame);
    socket.on(ServerEvents.PlayUpdate, updatePlayState);
    socket.on(ServerEvents.PaddleUpdate, updateOpponentPaddle);
    socket.on(ServerEvents.GameEnd, endGame);

    return (): void => {
      socket.off(ServerEvents.LobbyState);
      socket.off(ServerEvents.GameInit);
      socket.off(ServerEvents.PlayUpdate);
      socket.off(ServerEvents.PaddleUpdate);
      socket.off(ServerEvents.GameEnd);
    };
  }, [socketRef, initGame, updatePlayState, endGame, updateOpponentPaddle, handleLobbyState]);
};
