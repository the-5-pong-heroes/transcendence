import type { GameState } from "./GameState";

type UpdateGameAction = { type: "update"; data: GameState };
type ResetGameAction = { type: "reset"; data: GameState };

export type GameAction = UpdateGameAction | ResetGameAction;
