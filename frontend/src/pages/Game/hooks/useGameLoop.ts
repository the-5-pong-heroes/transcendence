/* eslint max-lines: ["warn", 125] */
/* eslint-disable no-magic-numbers */

import { useRef, useState, useEffect, useCallback, useContext } from "react";

import type { GameOverlayRef } from "../GameOverlay";
import type { GameState } from "../@types";
import { computeScoreLabel } from "../helpers";
import { SocketContext } from "../../../contexts";

import { useControlledPaddle } from "./useControlledPaddle";

interface GameLoopParameters {
  overlayRef: React.RefObject<GameOverlayRef>;
}

interface GameLoopValues {
  gameRef: React.MutableRefObject<GameState | undefined>;
  ballRef: React.RefObject<THREE.Mesh>;
  paddleLeftRef: React.RefObject<THREE.Mesh>;
  paddleRightRef: React.RefObject<THREE.Mesh>;
  scoreLabel: string;
}

export const useGameLoop = ({ overlayRef }: GameLoopParameters): GameLoopValues => {
  useControlledPaddle();
  const { socketRef } = useContext(SocketContext);

  const gameRef = useRef<GameState>();
  const ballRef = useRef<THREE.Mesh>(null);
  const paddleLeftRef = useRef<THREE.Mesh>(null);
  const paddleRightRef = useRef<THREE.Mesh>(null);

  const [scoreLabel, setScoreLabel] = useState<string>(
    computeScoreLabel(gameRef.current?.score ? gameRef.current.score : { player1: 0, player2: 0, round: 0 })
  );

  const initGame = useCallback((gameState: GameState) => {
    console.log("🕵🏻🕵🏻🕵🏻 initGame");
    gameRef.current = gameState;
  }, []);

  const updateGame = useCallback((gameState: GameState) => {
    // console.log("Received gameState:", gameState);

    if (!gameState) {
      return console.log("⛔️ Error");
    }

    const { ball, paddleLeft, paddleRight, score, play } = gameState;

    // Update refs
    paddleLeftRef.current?.position.set(paddleLeft.posX, paddleLeft.posY, paddleLeft.posZ);
    paddleRightRef.current?.position.set(paddleRight.posX, paddleRight.posY, paddleRight.posZ);
    ballRef.current?.position.set(ball.posX, ball.posY, ball.posZ);
    // ballRef.current?.rotateZ(ball.rot);

    // Update state
    gameRef.current = { ball, paddleRight, paddleLeft, score, play };
  }, []);

  const resetGame = useCallback(() => {
    // console.log("🏁 resetGame");
    overlayRef?.current?.resetGame();
  }, [overlayRef]);

  const updateScore = useCallback((gameState: GameState) => {
    // console.log("📌 updateScore");
    const { score } = gameState;
    setScoreLabel(computeScoreLabel(score));
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    socket.on("initGame", initGame);
    console.log("🐙 yoyoy in useEffect");
    socket.on("updateGame", updateGame);
    socket.on("updateScore", updateScore);
    socket.on("resetGame", resetGame);

    return () => {
      socket.off("initGame");
      socket.off("updateGame");
      socket.off("updateScore");
      socket.off("resetGame");
    };
  }, [socketRef, initGame, updateGame, updateScore, resetGame]);

  return { gameRef, paddleLeftRef, paddleRightRef, ballRef, scoreLabel };
};
