import { ServerEvents } from "../events";
import type { GameState, ScoreState, PlayState } from "../states";
import { LobbyMode, LobbyStatus } from "../Lobby";
import { GameResult, PaddleSide, PaddleMove } from "../Game";
// import { Pong } from "../../gamePlay/pongCore";
import { Pong } from "shared/pongCore";

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
    pong: Pong;
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
    play: PlayState;
  };

  [ServerEvents.GameEnd]: {
    result: GameResult;
  }; 
};
