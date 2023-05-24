import { type PongState } from "@shared/pongCore/@types";

export type ServerPong = {
  pong: PongState;
  evaluated: boolean;
  timestamp: number;
  lastElapsedMs: number;
};
