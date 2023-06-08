/* eslint max-lines: ["warn", 170] */
import { useEffect } from "react";
import { toast } from "react-toastify";

import type {
  PaddleMove,
  LobbyState,
  PlayState,
  GameResult,
  PaddleSide,
  PongState,
  GameContextParameters,
  LobbyMode,
  GameMode,
} from "../@types";
import { ServerEvents } from "../@types";

import { useGameContext } from "./useGameContext";

import type { GameState } from "@types";
import { useAppContext, useSocket } from "@hooks";

const DELAY_START_ROUND = 500;

interface PaddleUpdateParameters {
  side: PaddleSide;
  move: PaddleMove;
}

interface InitGameParameters {
  side: PaddleSide;
  lobbyMode: LobbyMode;
  gameMode: GameMode;
}

interface GameEndParameters {
  result: GameResult;
  winnerName: string;
}

export const useGameEvents = (): void => {
  const { overlayRef, playRef, localPongRef, paddleSideRef, serverPongRef, lobbyRef }: GameContextParameters =
    useGameContext();

  const socket = useSocket();
  const { isRunning, quitGame }: GameState = useAppContext().gameState;

  useEffect(() => {
    const handleLobbyState = (lobby: LobbyState): void => {
      lobbyRef.current = lobby;
      overlayRef?.current?.setGamePlayers(lobby.userLeft, lobby.userRight);
      if (lobbyRef.current.status === "waiting") {
        overlayRef?.current?.showLoader(true);
      } else {
        overlayRef?.current?.showLoader(false);
      }
      if (!isRunning.current) {
        isRunning.current = true;
      }
    };

    const initGame = (data: InitGameParameters): void => {
      overlayRef?.current?.initGame();
      const { side, lobbyMode, gameMode } = data;
      paddleSideRef.current = side;
      overlayRef?.current?.startGame(lobbyMode, gameMode);
    };

    const setPlay = (): void => {
      playRef.current.started = true;
      if (!quitGame) {
        playRef.current.paused = false;
      }
    };

    let timeoutId: NodeJS.Timeout | undefined;
    const startGame = (time: number): void => {
      if (!isRunning.current) {
        isRunning.current = true;
      }
      overlayRef?.current?.showCountdown();
      const currentTime = Date.now();
      const timeUntilTarget = time - currentTime;
      timeoutId = setTimeout(setPlay, timeUntilTarget);
    };

    const updateGame = (serverPong: PongState): void => {
      const lastUpdate = serverPongRef.current ? serverPongRef.current.timestamp : Date.now() - DELAY_START_ROUND;
      serverPongRef.current = {
        pong: serverPong,
        evaluated: false,
        timestamp: Date.now(),
        lastElapsedMs: Date.now() - lastUpdate,
      };
    };

    const endGame = (gameResult: GameEndParameters): void => {
      if (playRef.current) {
        playRef.current.started = false;
        playRef.current.paused = true;
      }
      overlayRef?.current?.setResult(gameResult.result, gameResult.winnerName);
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
        overlayRef?.current?.setPause(play.paused);
      }
    };

    const handlePlayerAlreadySet = (): void => {
      toast.warning("Sorry, you can't play against yourself...");
      overlayRef?.current?.resetGame();
    };

    socket.on(ServerEvents.LobbyState, handleLobbyState);
    socket.on(ServerEvents.GameInit, initGame);
    socket.on(ServerEvents.GameStart, startGame);
    socket.on(ServerEvents.GameUpdate, updateGame);
    socket.on(ServerEvents.PlayUpdate, updatePlayState);
    socket.on(ServerEvents.PaddleUpdate, updateOpponentPaddle);
    socket.on(ServerEvents.GameEnd, endGame);
    socket.on(ServerEvents.PlayerAlreadySet, handlePlayerAlreadySet);

    return (): void => {
      socket.off(ServerEvents.LobbyState);
      socket.off(ServerEvents.GameInit);
      socket.off(ServerEvents.GameStart);
      socket.off(ServerEvents.GameUpdate);
      socket.off(ServerEvents.PlayUpdate);
      socket.off(ServerEvents.PaddleUpdate);
      socket.off(ServerEvents.GameEnd);
      socket.off(ServerEvents.PlayerAlreadySet);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [socket, paddleSideRef, playRef, overlayRef, localPongRef, serverPongRef, isRunning, quitGame, lobbyRef]);
};
