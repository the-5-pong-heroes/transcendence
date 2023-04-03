import { ServerEvents } from "../events";
import type { ScoreState, PlayState } from "../states";
import { LobbyMode, LobbyStatus } from "../Lobby";
import { GameResult, PaddleSide, PaddleMove } from "../Game";
import { PongState } from "shared/pongCore/@types";

export type ServerPayloads = {
  [ServerEvents.LobbyState]: {
    mode: LobbyMode;
    status: LobbyStatus;
  };

  [ServerEvents.GameInit]: {
    paddleSide: PaddleSide;
  };

  [ServerEvents.GameUpdate]: {
    pong: PongState;
  };

  [ServerEvents.GameStart]: {
    time: number;
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
