import { ServerEvents } from "../events";
import type { ScoreState, PlayState } from "../states";
import { LobbyState, LobbyMode } from "../Lobby";
import { GameResult, PaddleSide, PaddleMove, GameMode } from "../Game";
import { PongState } from "shared/pongCore/@types";
import { AuthenticatedSocket } from "./AuthenticatedSocket";

export type ServerPayloads = {
  [ServerEvents.LobbyState]: LobbyState;

  [ServerEvents.GameInit]: {
    side: PaddleSide;
    lobbyMode: LobbyMode;
    gameMode: GameMode;
  };

  [ServerEvents.GameUpdate]: PongState;

  [ServerEvents.GameStart]: number;

  [ServerEvents.PlayUpdate]: PlayState;

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
    winnerName: string | undefined;
    loserName: string | undefined;
  };

  [ServerEvents.GameList]: LobbyState[];

  [ServerEvents.GameInvite]: {
    socketId: AuthenticatedSocket["id"];
    username: string;
  };

  [ServerEvents.LobbyMessage]: string;
};
