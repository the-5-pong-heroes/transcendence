import { useCallback, useRef, useEffect, useContext } from "react";

import { type PlayState } from "../@types";
import { SocketContext } from "../../../contexts";

import { useKeyboard } from "./useKeyboard";

interface PauseValues {
  playRef: React.MutableRefObject<PlayState>;
}
export const getInitialPlayState = (): PlayState => ({
  started: false,
  paused: true,
});

export const usePause = (): PauseValues => {
  const { socketRef } = useContext(SocketContext);
  const playRef = useRef<PlayState>(getInitialPlayState());

  useEffect(() => {
    const socket = socketRef.current;
    socket?.on("pauseGame", (payload: string) => {
      console.log("Received message:", payload);
    });

    return () => {
      socket?.off("pauseGame");
    };
  }, [socketRef]);

  const stopOrPlay = useCallback(() => {
    if (playRef.current.started) {
      socketRef.current?.emit("pauseGame");
      playRef.current.paused = !playRef.current.paused;
    }
  }, [socketRef]);

  useKeyboard({
    targetKey: "Space",
    onKeyDown: stopOrPlay,
  });

  return { playRef };
};
