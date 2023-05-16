import { type Socket } from "socket.io-client";

export interface SocketContextParameters {
  socketRef: React.MutableRefObject<Socket | undefined>;
  socketReady: boolean;
}
