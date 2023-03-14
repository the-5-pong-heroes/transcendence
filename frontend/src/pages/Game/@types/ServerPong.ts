// import type { Pong } from "../pongCore";
import type { Pong } from "shared/pongCore";

export type ServerPong = {
  pong: Pong;
  evaluated: boolean;
};
