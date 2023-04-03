import { type GameResult } from "../../@types";

export interface GameOverlayRef {
  showLoader: (value: boolean) => void;
  showCountdown: () => void;
  setResult: (result: GameResult) => void;
}
