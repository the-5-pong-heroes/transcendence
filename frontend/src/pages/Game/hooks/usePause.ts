import { useCallback, useRef } from "react";

import { type PlayState } from "../@types";
import type { GameOverlayRef } from "../GameOverlay";

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
  const playRef = useRef<PlayState>(getInitialPlayState());

  const stopOrPlay = useCallback(() => {
    overlayRef?.current?.pauseGame();
  }, [overlayRef]);

  const quit = useCallback(() => {
    overlayRef?.current?.showQuitModal();
  }, [overlayRef]);

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
