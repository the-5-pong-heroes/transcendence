import { useCallback, useContext } from "react";

import { SocketContext } from "../../../contexts";
import { GameContext } from "../context/GameContext";
import { ClientEvents } from "../@types";

import { useKeyboard } from "./useKeyboard";

export const useControlledPaddle = (): void => {
  const { socketRef } = useContext(SocketContext);
  const { pong, paddleSideRef } = useContext(GameContext);

  const moveUp = useCallback(() => {
    if (pong.paddleLastMove(paddleSideRef.current) !== "up") {
      socketRef.current?.emit(ClientEvents.UserMove, { move: "up" });
      pong.updatePaddleVelocity(paddleSideRef.current, "up");
    }
  }, [socketRef, pong, paddleSideRef]);

  const moveDown = useCallback(() => {
    if (pong.paddleLastMove(paddleSideRef.current) !== "down") {
      socketRef.current?.emit(ClientEvents.UserMove, { move: "down" });
      pong.updatePaddleVelocity(paddleSideRef.current, "down");
    }
  }, [socketRef, pong, paddleSideRef]);

  const stop = useCallback(() => {
    if (pong.paddleLastMove(paddleSideRef.current) !== "stop") {
      socketRef.current?.emit(ClientEvents.UserMove, { move: "stop" });
      pong.updatePaddleVelocity(paddleSideRef.current, "stop");
    }
  }, [socketRef, pong, paddleSideRef]);

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
