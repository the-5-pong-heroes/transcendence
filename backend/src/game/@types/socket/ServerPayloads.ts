import { ServerEvents } from "../events";
import type { GameState, ScoreState, PlayState } from "../states";
import { LobbyMode, LobbyStatus } from "../Lobby";
import { GameResult, PaddleSide, PaddleMove } from "../Game";

export type ServerPayloads = {
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    mode: LobbyMode;
    status: LobbyStatus;
    game: GameState;
  };

  [ServerEvents.GameInit]: {
    paddleSide: PaddleSide;
  };

  [ServerEvents.GameUpdate]: {
    game: GameState;
  };

  [ServerEvents.PlayUpdate]: {
    play: PlayState;
  };

  [ServerEvents.PaddleUpdate]: {
    side: PaddleSide;
    move: PaddleMove;
  };

  [ServerEvents.ScoreUpdate]: {
    score: ScoreState;
  };

  [ServerEvents.GameEnd]: {
    result: GameResult;
  }; 
};
