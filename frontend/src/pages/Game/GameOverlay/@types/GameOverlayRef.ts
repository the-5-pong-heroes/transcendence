import type { GameResult, LobbyMode, GameMode } from "@Game/@types";

export interface GameOverlayRef {
  showLoader: (value: boolean) => void;
  showCountdown: () => void;
  setResult: (result: GameResult, winner: string) => void;
  pauseGame: () => void;
  setPause: (value: boolean) => void;
  showQuitModal: () => boolean;
  resetGame: () => void;
  initGame: () => void;
  startGame: (mode: LobbyMode, gameMode: GameMode) => void;
  setGamePlayers: (user1: string, user2: string) => void;
}
