import { useCallback, useRef } from "react";

import { PADDLE_VELOCITY } from "../constants";
import { useKeyboard } from "../../hooks";

interface ControlledPaddleValues {
  velY: React.MutableRefObject<number>;
}

export const useControlledPaddle = (): ControlledPaddleValues => {
  const velY = useRef<number>(0);

  const moveUp = useCallback(() => {
    velY.current = -PADDLE_VELOCITY;
  }, []);
  const moveDown = useCallback(() => {
    velY.current = PADDLE_VELOCITY;
  }, []);
  const stop = useCallback(() => {
    velY.current = 0;
  }, []);

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

  return { velY };
};
