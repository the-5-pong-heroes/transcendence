import { type GameResult } from "../../@types";

export interface GameOverlayRef {
  showLoader: (value: boolean) => void;
  setResult: (result: GameResult) => void;
}
