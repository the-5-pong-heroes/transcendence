import { useContext } from "react";

import { SocketContext } from "@/contexts/Socket";
import type { SocketParameters, CustomSocket } from "@types";

export const useSocketContext = (): SocketParameters => {
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error("Undefined SocketContext");
  }

  return {
    customSocket: socketContext.customSocket,
    socket: socketContext.socketRef.current,
    socketReady: socketContext.socketReady,
  };
};

export const useSocket = (): CustomSocket => {
  const { customSocket }: SocketParameters = useSocketContext();

  return customSocket;
};
