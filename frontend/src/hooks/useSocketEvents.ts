import { useEffect } from "react";
import { toast } from "react-toastify";
import { type Socket } from "socket.io-client";

import { useCustomNavigate } from "./useCustomNavigate";
import { useAppContext } from "./useAppContext";

import { useSignOut } from "@/pages/Login/hooks";
import type { InvitationState } from "@types";
import { ServerEvents } from "@Game/@types";

interface WebSocketError {
  status: string;
  error: string;
  message: string;
}

interface GameInviteProps {
  socketId: string;
  userName: string;
}

interface SocketEventsProps {
  socketRef: React.MutableRefObject<Socket | undefined>;
}

export const useSocketEvents = ({ socketRef }: SocketEventsProps): void => {
  const { setInvitation, senderSocket, senderName }: InvitationState = useAppContext().invitationState;
  const navigate = useCustomNavigate();
  const signOut = useSignOut();

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    const handleAlreadyConnected = (): void => {
      toast.warning(`You're already connected !`);
    };

    const handleGameInvite = ({ socketId, userName }: GameInviteProps): void => {
      toast.info(`${userName} invited you to play a game!`);
      senderSocket.current = socketId;
      senderName.current = userName;
      setInvitation(true);
    };

    const displayMessage = (message: string): void => {
      toast.info(message);
    };

    const handleError = (data: WebSocketError): void => {
      if (data && data !== undefined) {
        toast.error(`Error websockets: ${data.error}`);
      } else {
        toast.error(`Error websockets...`);
      }
    };

    const startGameInvite = (): void => {
      navigate("/Game");
    };

    const disconnect = (): void => {
      signOut();
    };

    socket.on(ServerEvents.Connect, handleAlreadyConnected);
    socket.on(ServerEvents.GameInvite, handleGameInvite);
    socket.on(ServerEvents.GameInviteStart, startGameInvite);
    socket.on(ServerEvents.LobbyMessage, displayMessage);
    socket.on(ServerEvents.Disconnect, disconnect);
    socket.on("exception", handleError);

    return (): void => {
      socket.off(ServerEvents.Connect);
      socket.off(ServerEvents.GameInvite);
      socket.off(ServerEvents.GameInviteStart);
      socket.off(ServerEvents.LobbyMessage);
      socket.off(ServerEvents.Disconnect);
      socket.off("exception");
    };
  }, [socketRef, navigate, setInvitation, senderSocket, senderName, signOut]);
};
