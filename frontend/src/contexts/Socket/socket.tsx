import React from "react";
import { type Socket } from "socket.io-client";

import { useSocket } from "../../hooks";

interface ContextParameters {
  socketRef: React.MutableRefObject<Socket | undefined>;
}

interface ProviderParameters {
  children: React.ReactNode;
}

export const SocketContext = React.createContext<ContextParameters>({
  socketRef: { current: undefined },
});

export const SocketContextProvider: React.FC<ProviderParameters> = ({ children }) => {
  const { socketRef } = useSocket();

  return <SocketContext.Provider value={{ socketRef }}>{children}</SocketContext.Provider>;
};
