import { useEffect } from "react";

const EMPTY_CALLBACK = (): void => {
  // do nothing
};

interface KeyboardParameters {
  targetKey: string;
  onKeyDown?: () => void;
  onKeyUp?: () => void;
}

export function useKeyboard({
  targetKey,
  onKeyDown = EMPTY_CALLBACK,
  onKeyUp = EMPTY_CALLBACK,
}: KeyboardParameters): void {
  useEffect(() => {
    const downHandler = (event: KeyboardEvent): void => {
      event.preventDefault();
      if (event.code === targetKey) {
        onKeyDown();
      }
    };
    window.addEventListener("keydown", downHandler);

    const upHandler = (event: KeyboardEvent): void => {
      event.preventDefault();
      if (event.code === targetKey) {
        onKeyUp();
      }
    };
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", downHandler);
    };
  });
}
