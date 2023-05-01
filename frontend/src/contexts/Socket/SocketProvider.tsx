import React, { useMemo } from "react";
import { type Socket } from "socket.io-client";

import { useSocket } from "../../hooks";

import { SocketContext } from "./SocketContext";

interface ContextParameters {
  socketRef: React.MutableRefObject<Socket | undefined>;
}

interface ProviderParameters {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<ProviderParameters> = ({ children }) => {
  const { socketRef } = useSocket();
  const socketContext = useMemo((): ContextParameters => ({ socketRef }), [socketRef]);

  return <SocketContext.Provider value={socketContext}>{children}</SocketContext.Provider>;
};
