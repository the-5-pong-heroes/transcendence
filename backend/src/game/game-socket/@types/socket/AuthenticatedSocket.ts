import { Socket } from "socket.io";
import { Lobby } from "../../lobby";
import { TServerEvents } from "../events";
import type { PaddleSide } from "../Game";
// import type { Paddle } from "../../gamePlay/pongCore";
import { type Paddle } from "shared/pongCore";

export type AuthenticatedSocket = Socket & {
  data: {
    lobby: null | Lobby;
    // paddleSide: null | PaddleSide;
    paddle: Paddle<PaddleSide>;
  };

  emit: <T>(ev: TServerEvents, data: T) => boolean;
};
