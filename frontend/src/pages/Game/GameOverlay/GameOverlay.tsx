import React, { useImperativeHandle, useState } from "react";

import type { LobbyMode, GameResult, GameContextParameters, GameMode } from "../@types";
import { ClientEvents } from "../@types";
import { useGameContext } from "../hooks";

import type { GameOverlayRef } from "./@types";
import { Loader, LobbyModeButton, Result, Countdown, QuitModal, Pause, Players } from "./components";
import "./GameOverlay.css";

import { useSocket } from "@hooks";

interface Players {
  player1: string;
  player2: string;
}

const _GameOverlay: React.ForwardRefRenderFunction<GameOverlayRef> = () => {
  const { height, width, overlayRef, gameMode, setGameMode, playRef, paddleSideRef }: GameContextParameters =
    useGameContext();
  const socket = useSocket();

  const containerStyle: React.CSSProperties = {
    height,
    width,
  };

  const [loader, setLoader] = useState<boolean>(false);
  const [quitGame, setQuitGame] = useState<boolean>(false);
  const [quitModal, setQuitModal] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [gameResult, setGameResult] = useState<GameResult | undefined>(undefined);
  const [gameWinner, setGameWinner] = useState<string | undefined>(undefined);
  const [lobbyMode, setLobbyMode] = useState<LobbyMode | undefined>(undefined);
  const [pause, setPause] = useState<boolean>(false);
  const [players, setPlayers] = useState<Players>({ player1: "", player2: "" });

  useImperativeHandle(overlayRef, () => ({
    showLoader: (value: boolean) => {
      setLoader(value);
    },
    showCountdown: () => {
      setCountdown(3);
      setPause(false);
    },
    setResult: (result: GameResult, winner: string) => {
      setGameResult(result);
      setGameWinner(winner);
    },
    pauseGame: () => {
      if (playRef.current.started && paddleSideRef.current) {
        socket.emit(ClientEvents.GamePause);
        setPause((paused) => !paused);
      }
    },
    setPause: (value: boolean) => {
      if (playRef.current.started) {
        setPause(value);
      }
    },
    showQuitModal: (): boolean => {
      if (playRef.current.started && !playRef.current.paused && paddleSideRef.current) {
        socket.emit(ClientEvents.GamePause);
        setPause((paused) => !paused);
      }
      setCountdown(0);
      setQuitModal(true);

      return quitGame;
    },
    resetGame: () => {
      socket.emit(ClientEvents.LobbyLeave);
      setLoader(false);
      setQuitGame(false);
      setQuitModal(false);
      setCountdown(0);
      setGameResult(undefined);
      setLobbyMode(undefined);
      setPause(false);
      setGameMode(undefined);
      paddleSideRef.current = undefined;
    },
    initGame: () => {
      setLoader(false);
      setQuitGame(false);
      setQuitModal(false);
      setCountdown(0);
      setGameResult(undefined);
      setPause(false);
    },
    startGame: (mode: LobbyMode, gameMode: GameMode) => {
      setLobbyMode(mode);
      setGameMode(gameMode);
    },
    setGamePlayers: (user1: string, user2: string) => {
      setPlayers({ player1: user1, player2: user2 });
    },
  }));

  if (!gameMode) {
    return null;
  }

  return (
    <div className="overlay" style={containerStyle}>
      <Players player1={players.player1} player2={players.player2} />
      <Loader loader={loader} />
      {countdown > 0 && <Countdown countdown={countdown} setCountdown={setCountdown} />}
      <LobbyModeButton gameMode={gameMode} lobbyMode={lobbyMode} setLobbyMode={setLobbyMode} />
      <Result result={gameResult} winner={gameWinner} index={Math.floor(Math.random() * 5)} />
      {quitModal && <QuitModal setQuitModal={setQuitModal} setQuitGame={setQuitGame} setLobbyMode={setLobbyMode} />}
      {pause && <Pause />}
    </div>
  );
};

export const GameOverlay = React.forwardRef(_GameOverlay);
