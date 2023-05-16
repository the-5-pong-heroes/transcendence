import React, { useMemo, useState } from "react";

import { SocketContext } from "./SocketContext";

import type { SocketContextParameters } from "@types";
import { useSocket } from "@/hooks/useSocket";

interface ProviderParameters {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<ProviderParameters> = ({ children }) => {
  const [socketReady, setSocketReady] = useState<boolean>(false);
  const { socketRef } = useSocket({ setSocketReady });

  const socketContext = useMemo((): SocketContextParameters => ({ socketRef, socketReady }), [socketRef, socketReady]);

  return <SocketContext.Provider value={socketContext}>{children}</SocketContext.Provider>;
};
