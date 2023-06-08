import React, { useMemo, useState } from "react";

import { SocketContext } from "./SocketContext";

import { type SocketContextParameters, CustomSocket } from "@types";
import { useSocketInit } from "@/hooks/useSocketInit";

interface ProviderParameters {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<ProviderParameters> = ({ children }) => {
  const [socketReady, setSocketReady] = useState<boolean>(false);
  const { socketRef } = useSocketInit({ setSocketReady });
  const customSocket = useMemo(() => new CustomSocket(socketRef), [socketRef]);

  const socketContext = useMemo(
    (): SocketContextParameters => ({ customSocket, socketRef, socketReady }),
    [customSocket, socketRef, socketReady]
  );

  return <SocketContext.Provider value={socketContext}>{children}</SocketContext.Provider>;
};
