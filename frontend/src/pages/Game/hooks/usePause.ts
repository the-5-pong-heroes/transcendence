import { useCallback, useRef } from "react";

<<<<<<< HEAD
import { type PlayState } from "../@types";
import type { GameOverlayRef } from "../GameOverlay";
=======
import { type PlayState, ClientEvents } from "../@types";
import type { GameOverlayRef } from "../GameOverlay";
import { SocketContext } from "../../../contexts";
>>>>>>> master

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
<<<<<<< HEAD
=======
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error("Undefined SocketContext");
  }
  const { socketRef } = socketContext;

>>>>>>> master
  const playRef = useRef<PlayState>(getInitialPlayState());

  const stopOrPlay = useCallback(() => {
    overlayRef?.current?.pauseGame();
  }, [overlayRef]);

  const quit = useCallback(() => {
    overlayRef?.current?.showQuitModal();
  }, [overlayRef]);

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
