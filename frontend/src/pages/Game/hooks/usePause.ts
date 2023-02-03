import { useCallback, useRef } from "react";

import { type PlayState } from "../Pong2D/@types";

import { useKeyboard } from "./useKeyboard";

interface PauseValues {
  playRef: React.MutableRefObject<PlayState>;
}
export const getInitialPlayState = (): PlayState => ({
  started: false,
  paused: true,
});

export const usePause = (): PauseValues => {
  const playRef = useRef<PlayState>(getInitialPlayState());

  const stopOrPlay = useCallback(() => {
    if (playRef.current.started) {
      playRef.current.paused = !playRef.current.paused;
    }
  }, []);

  useKeyboard({
    targetKey: "Space",
    onKeyDown: stopOrPlay,
  });

  return { playRef };
};

// interface PauseValues {
//   paused: React.MutableRefObject<boolean>;
// }

// export const usePause = (): PauseValues => {
//   const paused = useRef<boolean>(true);

//   const stopOrPlay = useCallback(() => {
//     paused.current = !paused.current;
//   }, []);

//   useKeyboard({
//     targetKey: "Space",
//     onKeyDown: stopOrPlay,
//   });

//   return { paused };
// };
