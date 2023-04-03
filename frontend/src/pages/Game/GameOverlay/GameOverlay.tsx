import React, { useImperativeHandle, useState, useContext } from "react";

import type { GameMode, LobbyMode, GameResult } from "../@types";
import { GameContext } from "../context/GameContext";

import type { GameOverlayRef } from "./@types";
import { Loader, LobbyModeButton, Result, Countdown } from "./components";

import "./GameOverlay.css";

interface GameOverlayProps {
  height: number;
  width: number;
  overlayRef: React.RefObject<GameOverlayRef> | undefined;
  gameMode: GameMode | undefined;
  setGameMode: (mode: GameMode) => void;
}

const _GameOverlay: React.ForwardRefRenderFunction<GameOverlayRef> = () => {
  const gameContext = useContext(GameContext);
  if (gameContext === undefined) {
    throw new Error("Undefined GameContext");
  }
  const { height, width, overlayRef, gameMode, setGameMode }: GameOverlayProps = gameContext;

  const containerStyle: React.CSSProperties = {
    height,
    width,
  };

  const [loader, setLoader] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [gameResult, setGameResult] = useState<GameResult | undefined>(undefined);
  const [lobbyMode, setLobbyMode] = useState<LobbyMode | undefined>(undefined);

  useImperativeHandle(overlayRef, () => ({
    showLoader: (value: boolean) => {
      setLoader(value);
    },
    showCountdown: () => {
      setCountdown(3);
    },
    setResult: (result: GameResult) => {
      setGameResult(result);
    },
  }));

  if (!gameMode) {
    return null;
  }

  return (
    <div className="overlay" style={containerStyle}>
      <Loader loader={loader} />
      {countdown > 0 && <Countdown countdown={countdown} setCountdown={setCountdown} />}
      <LobbyModeButton gameMode={gameMode} lobbyMode={lobbyMode} setLobbyMode={setLobbyMode} />
      <Result result={gameResult} setResult={setGameResult} setLobbyMode={setLobbyMode} setGameMode={setGameMode} />
    </div>
  );
};

export const GameOverlay = React.forwardRef(_GameOverlay);
