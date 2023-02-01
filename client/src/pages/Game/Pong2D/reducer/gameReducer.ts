import type { GameAction, GameState } from "../@types";

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "update":
      return action.data;
    case "reset":
      return action.data;
    default:
      return state;
  }
};
