import type { GameState } from "@types";

interface OnClickMenuProps {
  event?: React.MouseEvent<HTMLAnchorElement>;
  path: string;
  menuRef: React.RefObject<HTMLDivElement>;
  gameState: GameState;
  isNavigatingRef: React.MutableRefObject<boolean>;
}

export const handleOnClickButton = ({ event, path, menuRef, gameState, isNavigatingRef }: OnClickMenuProps): void => {
  isNavigatingRef.current = true;
  const { isRunning, setQuitGame, newRoute }: GameState = gameState;
  if (isRunning.current) {
    event?.preventDefault();
    setQuitGame(true);
    newRoute.current = path;
  } else {
    menuRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  setTimeout(() => (isNavigatingRef.current = false), 3000); // milliseconds
};
