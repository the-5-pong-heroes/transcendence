import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

const ENDPOINT = "http://localhost:3333";

interface SocketValues {
  socketRef: React.MutableRefObject<Socket | undefined>;
}

export const useSocket = (): SocketValues => {
  const socketRef = useRef<Socket>();

  useEffect(() => {
    socketRef.current = io(ENDPOINT);

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return { socketRef };
};
