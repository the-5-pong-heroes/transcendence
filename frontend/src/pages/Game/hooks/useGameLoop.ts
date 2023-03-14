/* eslint max-lines: ["warn", 255] */
/* eslint-disable no-magic-numbers */

import { useRef, useState, useEffect, useCallback, useContext } from "react";
import { useFrame } from "@react-three/fiber";

import { GameContext } from "../context";
import type { GameOverlayRef } from "../GameOverlay";
import type { GameState, ScoreState, PaddleMove, LobbyState, PlayState, GameResult, PaddleSide } from "../@types";
import { ServerEvents } from "../@types";
import { computeScoreLabel, getInitialGameState } from "../helpers";
import { SocketContext } from "../../../contexts";
import type { Pong } from "../pongCore";

import { useControlledPaddle } from "./useControlledPaddle";

interface PaddleUpdateParameters {
  side: PaddleSide;
  move: PaddleMove;
}

interface GameLoopParameters {
  overlayRef: React.RefObject<GameOverlayRef> | undefined;
  playRef: React.MutableRefObject<PlayState | undefined>;
  pong: Pong;
  paddleSideRef: React.MutableRefObject<PaddleSide>;
}

interface GameLoopValues {
  gameRef: React.MutableRefObject<GameState | undefined>;
  ballRef: React.RefObject<THREE.Mesh>;
  paddleLeftRef: React.RefObject<THREE.Mesh>;
  paddleRightRef: React.RefObject<THREE.Mesh>;
  scoreLabel: string;
}

export const useGameLoop = (): GameLoopValues => {
  const { overlayRef, playRef, pong, paddleSideRef }: GameLoopParameters = useContext(GameContext);
  const { socketRef } = useContext(SocketContext);
  useControlledPaddle();

  const gameRef = useRef<GameState>(getInitialGameState());
  const ballRef = useRef<THREE.Mesh>(null);
  const paddleLeftRef = useRef<THREE.Mesh>(null);
  const paddleRightRef = useRef<THREE.Mesh>(null);

  const [scoreLabel, setScoreLabel] = useState<string>(
    computeScoreLabel(gameRef.current?.score ? gameRef.current.score : { player1: 0, player2: 0, round: 0 })
  );

  // const gameLoop = useCallback(
  //   (delta: number): void => {
  //     if (playRef.current?.paused) {
  //       return;
  //     }
  //     pong.update(delta);
  //     pong.detectCollisions();
  //     const ball = pong.ball.getState();
  //     const paddleRight = pong.paddle.right.getState();
  //     const paddleLeft = pong.paddle.left.getState();
  //     const play = {
  //       started: playRef?.current ? playRef.current.started : false,
  //       paused: playRef?.current ? playRef.current.paused : false,
  //     };
  //     paddleLeftRef.current?.position.set(paddleLeft.pos.x, paddleLeft.pos.y, paddleLeft.pos.z);
  //     paddleRightRef.current?.position.set(paddleRight.pos.x, paddleRight.pos.y, paddleRight.pos.z);
  //     ballRef.current?.position.set(ball.pos.x, ball.pos.y, ball.pos.z);
  //     gameRef.current.play = play;
  //     gameRef.current.ball = ball;
  //     gameRef.current.paddleRight = paddleRight;
  //     gameRef.current.paddleLeft = paddleLeft;
  //   },
  //   [playRef, pong]
  // );

  // const timeRef = useRef<number>(Date.now());
  // useFrame(() => {
  //   const currentTime = Date.now();
  //   const deltaTime = currentTime - timeRef.current;
  //   gameLoop(deltaTime);
  //   timeRef.current = currentTime;
  // });

  const updateGame = useCallback((gameState: GameState) => {
    if (!gameState) {
      return console.log("⛔️ Error");
    }

    const { ball, paddleLeft, paddleRight, score, play } = gameState;

    // Update refs
    paddleLeftRef.current?.position.set(paddleLeft.pos.x, paddleLeft.pos.y, paddleLeft.pos.z);
    paddleRightRef.current?.position.set(paddleRight.pos.x, paddleRight.pos.y, paddleRight.pos.z);
    ballRef.current?.position.set(ball.pos.x, ball.pos.y, ball.pos.z);

    // Update state
    gameRef.current = { ball, paddleLeft, paddleRight, score, play };
  }, []);

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
      pong.initRound(0);
    },
    [playRef, overlayRef, pong]
  );

  const updateScore = useCallback(
    (score: ScoreState) => {
      gameRef.current.score = score;
      setScoreLabel(computeScoreLabel(score));
      pong.initRound(score.round);
    },
    [pong]
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
      pong.updatePaddleVelocity(side, move);
    },
    [pong]
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
    socket.on(ServerEvents.GameUpdate, updateGame);
    socket.on(ServerEvents.PaddleUpdate, updateOpponentPaddle);
    socket.on(ServerEvents.ScoreUpdate, updateScore);
    socket.on(ServerEvents.GameEnd, endGame);

    return () => {
      socket.off(ServerEvents.LobbyState);
      socket.off(ServerEvents.GameInit);
      socket.off(ServerEvents.PlayUpdate);
      socket.off(ServerEvents.GameUpdate);
      socket.off(ServerEvents.PaddleUpdate);
      socket.off(ServerEvents.ScoreUpdate);
      socket.off(ServerEvents.GameEnd);
    };
  }, [socketRef, initGame, updateGame, updatePlayState, updateScore, endGame, updateOpponentPaddle, handleLobbyState]);

  return { gameRef, paddleLeftRef, paddleRightRef, ballRef, scoreLabel };
};
