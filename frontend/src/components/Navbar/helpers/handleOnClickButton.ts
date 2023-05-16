import type { GameState } from "@types";

interface OnClickMenuProps {
  event: React.MouseEvent<HTMLAnchorElement>;
  path: string;
  menuRef: React.RefObject<HTMLDivElement>;
  gameState: GameState;
}

export const handleOnClickButton = ({ event, path, menuRef, gameState }: OnClickMenuProps): void => {
  const { isRunning, setQuitGame, newRoute }: GameState = gameState;
  if (isRunning.current) {
    event.preventDefault();
    setQuitGame(true);
    newRoute.current = path;
  } else {
    menuRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
};
