import { useCallback, useRef, useContext } from "react";

import { type PlayState, ClientEvents } from "../@types";
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
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error("Undefined SocketContext");
  }
  const { socketRef } = socketContext;

  const playRef = useRef<PlayState>(getInitialPlayState());

  const stopOrPlay = useCallback(() => {
    if (playRef.current.started) {
      socketRef.current?.emit(ClientEvents.GamePause);
    }
  }, [socketRef]);

  useKeyboard({
    targetKey: "Space",
    onKeyDown: stopOrPlay,
  });

  return { playRef };
};
