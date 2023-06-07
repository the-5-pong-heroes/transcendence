import { useSocketContext } from "@hooks";
import type { CustomSocket, SocketParameters } from "@types";

export const useSocket = (): CustomSocket => {
  const { customSocket }: SocketParameters = useSocketContext();

  return customSocket;
};
