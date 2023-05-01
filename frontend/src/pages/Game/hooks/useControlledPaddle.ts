import { useCallback, useContext } from "react";

import { SocketContext } from "../../../contexts";
import { GameContext } from "../context/GameContext";
import { ClientEvents } from "../@types";

import { useKeyboard } from "./useKeyboard";

export const useControlledPaddle = (): void => {
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error("Undefined SocketContext");
  }
  const { socketRef } = socketContext;

  const gameContext = useContext(GameContext);
  if (gameContext === undefined) {
    throw new Error("Undefined GameContext");
  }
  const { localPongRef, paddleSideRef } = gameContext;

  const moveUp = useCallback(() => {
    if (localPongRef.current.paddleLastMove(paddleSideRef.current) !== "up") {
      // socketRef.current?.emit(ClientEvents.UserMove, { move: 4 });
      socketRef.current?.emit(ClientEvents.UserMove, { move: "up" });
      localPongRef.current.updatePaddleVelocity(paddleSideRef.current, "up");
    }
  }, [socketRef, localPongRef, paddleSideRef]);

  const moveDown = useCallback(() => {
    if (localPongRef.current.paddleLastMove(paddleSideRef.current) !== "down") {
      socketRef.current?.emit(ClientEvents.UserMove, { move: "down" });
      localPongRef.current.updatePaddleVelocity(paddleSideRef.current, "down");
    }
  }, [socketRef, localPongRef, paddleSideRef]);

  const stop = useCallback(() => {
    if (localPongRef.current.paddleLastMove(paddleSideRef.current) !== "stop") {
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
