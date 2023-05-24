import { useContext } from "react";

import { SocketContext } from "@/contexts/Socket";
import type { SocketParameters } from "@types";

export const useSocketContext = (): SocketParameters => {
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error("Undefined SocketContext");
  }

  return {
    socket: socketContext.socketRef.current,
    socketReady: socketContext.socketReady,
  };
};
