import { type PongState } from "../pongCore/@types";

export type ServerPong = {
  pong: PongState;
  evaluated: boolean;
  timestamp: number;
  lastElapsedMs: number;
};
