import { Socket } from "socket.io";
import { GameLobby } from "../../game.lobby";
import { TServerEvents } from "../events";
import type { PaddleSide } from "../Game";
import { type Paddle } from "shared/pongCore";

export type AuthenticatedSocket = Socket & {
  data: {
    userName: string;
    userId: string;
    readyToPlay: boolean;
    lobby: GameLobby | undefined;
    paddle: Paddle<PaddleSide> | undefined;
  };

  emit: <T>(ev: TServerEvents, data: T) => boolean;
};
