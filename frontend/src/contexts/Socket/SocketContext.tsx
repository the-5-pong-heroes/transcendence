import React from "react";
import { type Socket } from "socket.io-client";

interface ContextParameters {
  socketRef: React.MutableRefObject<Socket | undefined>;
}

export const SocketContext = React.createContext<ContextParameters | undefined>(undefined);
