import { useCallback } from "react";

import { ClientEvents, type GameContextParameters } from "../@types";

import { useGameContext } from "./useGameContext";
import { useKeyboard } from "./useKeyboard";

import { useSocket } from "@hooks";

export const useControlledPaddle = (): void => {
  const socket = useSocket();
  const { localPongRef, paddleSideRef }: GameContextParameters = useGameContext();

  const moveUp = useCallback(() => {
    if (paddleSideRef.current && localPongRef.current.paddleLastMove(paddleSideRef.current) !== "up") {
      socket.emit(ClientEvents.UserMove, { move: "up" });
      localPongRef.current.updatePaddleVelocity(paddleSideRef.current, "up");
    }
  }, [socket, localPongRef, paddleSideRef]);

  const moveDown = useCallback(() => {
    if (paddleSideRef.current && localPongRef.current.paddleLastMove(paddleSideRef.current) !== "down") {
      socket.emit(ClientEvents.UserMove, { move: "down" });
      localPongRef.current.updatePaddleVelocity(paddleSideRef.current, "down");
    }
  }, [socket, localPongRef, paddleSideRef]);

  const stop = useCallback(() => {
    if (paddleSideRef.current && localPongRef.current.paddleLastMove(paddleSideRef.current) !== "stop") {
      socket.emit(ClientEvents.UserMove, { move: "stop" });
      localPongRef.current.updatePaddleVelocity(paddleSideRef.current, "stop");
    }
  }, [socket, localPongRef, paddleSideRef]);

  useKeyboard({
    targetKey: "ArrowUp",
    onKeyDown: moveUp,
    onKeyUp: stop,
  });

  useKeyboard({
    targetKey: "ArrowDown",
    onKeyDown: moveDown,
    onKeyUp: stop,
  });
};
