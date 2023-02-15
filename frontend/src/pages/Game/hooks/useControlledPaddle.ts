import { useCallback, useContext } from "react";

import { SocketContext } from "../../../contexts";

import { useKeyboard } from "./useKeyboard";

export const useControlledPaddle = (): void => {
  const { socketRef } = useContext(SocketContext);

  const moveUp = useCallback(() => {
    socketRef.current?.emit("movePlayer", { move: "up" });
  }, [socketRef]);
  const moveDown = useCallback(() => {
    socketRef.current?.emit("movePlayer", { move: "down" });
  }, [socketRef]);
  const stop = useCallback(() => {
    socketRef.current?.emit("movePlayer", { move: "stop" });
  }, [socketRef]);

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
