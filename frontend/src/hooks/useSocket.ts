import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

import { useUser } from "./useUser";
import { useSocketEvents } from "./useSocketEvents";

import { ClientEvents } from "@Game/@types";

const ENDPOINT = "http://localhost:3000";

interface SocketProps {
  setSocketReady: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SocketValues {
  socketRef: React.MutableRefObject<Socket | undefined>;
}

export const useSocket = ({ setSocketReady }: SocketProps): SocketValues => {
  const { userAuth } = useUser();
  const socketRef = useRef<Socket>();
  useSocketEvents({ socketRef });

  useEffect(() => {
    if (userAuth) {
      socketRef.current = io(ENDPOINT, {
        autoConnect: false,
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: `Bearer ${userAuth.accessToken}`,
            },
          },
        },
        auth: {
          name: userAuth?.user.name,
          id: userAuth?.user.id,
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
    };
  }, [userAuth, setSocketReady]);

  return { socketRef };
};
