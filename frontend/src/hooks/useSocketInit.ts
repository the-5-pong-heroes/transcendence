import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

import { useUser } from "./useUser";
import { useSocketEvents } from "./useSocketEvents";

import { ClientEvents } from "@Game/@types";
import { WS_ENDPOINT } from "@/constants";

interface SocketProps {
  setSocketReady: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SocketValues {
  socketRef: React.MutableRefObject<Socket | undefined>;
}

export const useSocketInit = ({ setSocketReady }: SocketProps): SocketValues => {
  const user = useUser();
  const socketRef = useRef<Socket>();
  useSocketEvents({ socketRef });

  useEffect(() => {
    if (user) {
      socketRef.current = io(WS_ENDPOINT, {
        autoConnect: false,
        withCredentials: true,
        auth: {
          name: user?.name,
          id: user?.id,
        },
      });
      socketRef.current.on("connect", () => {
        setSocketReady(true);
      });
      socketRef.current?.connect();
      if (socketRef.current) {
        socketRef.current.emit(ClientEvents.GameConnect);
      }
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off("connect");
    };
  }, [user, setSocketReady]);

  return { socketRef };
};
