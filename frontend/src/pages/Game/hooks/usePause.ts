import { useCallback, useRef, useContext } from "react";

import { type PlayState, ClientEvents } from "../@types";
import type { GameOverlayRef } from "../GameOverlay";
import { SocketContext } from "../../../contexts";

import { useKeyboard } from "./useKeyboard";

interface PauseParameters {
  overlayRef: React.RefObject<GameOverlayRef> | undefined;
}

interface PauseValues {
  playRef: React.MutableRefObject<PlayState>;
}

export const getInitialPlayState = (): PlayState => ({
  started: false,
  paused: true,
});

export const usePause = ({ overlayRef }: PauseParameters): PauseValues => {
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

  const quit = useCallback(() => {
    if (playRef.current.started) {
      if (!playRef.current.paused) {
        socketRef.current?.emit(ClientEvents.GamePause);
      }
      overlayRef?.current?.quitGame();
    }
  }, [socketRef, overlayRef]);

  useKeyboard({
    targetKey: "Space",
    onKeyDown: stopOrPlay,
  });

  useKeyboard({
    targetKey: "Escape",
    onKeyDown: quit,
  });

  return { playRef };
};
