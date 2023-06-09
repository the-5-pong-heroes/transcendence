import React from "react";

import { ClientEvents } from "@Game/@types";
import { useSocket } from "@hooks";

interface InviteProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const InviteButton: React.FC<InviteProps> = ({ id, children, className = "", disabled = false }) => {
  const socket = useSocket();

  const inviteToPlay = (id?: string): void => {
    if (!id) {
      return;
    }
    socket.emit(ClientEvents.GameInvite, { userId: id });
  };

  return (
    <button className={className} onClick={() => inviteToPlay(id)} disabled={disabled}>
      {children}
    </button>
  );
};
