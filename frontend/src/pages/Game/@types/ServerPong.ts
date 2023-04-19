import { type PongState } from "../pongModel/@types";

export type ServerPong = {
  pong: PongState;
  evaluated: boolean;
  timestamp: number;
  lastElapsedMs: number;
};
