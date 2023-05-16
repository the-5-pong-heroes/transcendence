import { useCallback } from "react";

import { ClientEvents, type GameContextParameters } from "../@types";

import { useGameContext } from "./useGameContext";
import { useKeyboard } from "./useKeyboard";

import { useSocketContext } from "@hooks";
import type { SocketContextParameters } from "@types";

export const useControlledPaddle = (): void => {
  const { socketRef }: SocketContextParameters = useSocketContext();
  const { localPongRef, paddleSideRef }: GameContextParameters = useGameContext();

  const moveUp = useCallback(() => {
    if (paddleSideRef.current && localPongRef.current.paddleLastMove(paddleSideRef.current) !== "up") {
      socketRef.current?.emit(ClientEvents.UserMove, { move: "up" });
      localPongRef.current.updatePaddleVelocity(paddleSideRef.current, "up");
    }
  }, [socketRef, localPongRef, paddleSideRef]);

  const moveDown = useCallback(() => {
    if (paddleSideRef.current && localPongRef.current.paddleLastMove(paddleSideRef.current) !== "down") {
      socketRef.current?.emit(ClientEvents.UserMove, { move: "down" });
      localPongRef.current.updatePaddleVelocity(paddleSideRef.current, "down");
    }
  }, [socketRef, localPongRef, paddleSideRef]);

  const stop = useCallback(() => {
    if (paddleSideRef.current && localPongRef.current.paddleLastMove(paddleSideRef.current) !== "stop") {
      socketRef.current?.emit(ClientEvents.UserMove, { move: "stop" });
      localPongRef.current.updatePaddleVelocity(paddleSideRef.current, "stop");
    }
  }, [socketRef, localPongRef, paddleSideRef]);

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
