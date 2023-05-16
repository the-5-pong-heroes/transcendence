import { useContext } from "react";

import { SocketContext } from "@/contexts/Socket";
import type { SocketContextParameters } from "@types";

export const useSocketContext = (): SocketContextParameters => {
  const socketContext = useContext(SocketContext);
  if (socketContext === undefined) {
    throw new Error("Undefined SocketContext");
  }

  return socketContext;
};
