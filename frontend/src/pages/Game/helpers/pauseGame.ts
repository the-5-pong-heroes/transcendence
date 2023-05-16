import { type Socket } from "socket.io-client";

import { ClientEvents, type PlayState } from "@Game/@types";

interface PauseParameters {
  socketRef: React.MutableRefObject<Socket | undefined>;
  playRef: React.MutableRefObject<PlayState>;
}

export const pauseGame = ({ socketRef, playRef }: PauseParameters): void => {
  if (playRef.current.started && !playRef.current.paused) {
    socketRef.current?.emit(ClientEvents.GamePause);
  }
};

export const resumeGame = ({ socketRef, playRef }: PauseParameters): void => {
  if (playRef.current.started && playRef.current.paused) {
    socketRef.current?.emit(ClientEvents.GamePause);
  }
};
