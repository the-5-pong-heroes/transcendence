import React from "react";

import styles from "./Invitation.module.scss";

import { useUser, useSocket } from "@/hooks";
import { type IMessage } from "@/interfaces";
import { ClientEvents } from "@Game/@types";

interface IInvitationProps {
  message: IMessage;
  theme: string;
}

export const Invitation: React.FC<IInvitationProps> = ({ message, theme }) => {
  const user = useUser();
  const socket = useSocket();

  const handleClick = (): void => {
    if (!message.senderId || (user && user.id === message.senderId)) {
      return;
    }
    socket.emit(ClientEvents.GameInviteLink, { userId: message.senderId });
  };

  return (
    <div
      className={`${styles.Invitation}
        ${theme === "light" ? styles.InvitationLight : styles.InvitationDark}
        ${user?.id === message.senderId ? styles.InvitationOff : styles.InvitationOn}
      `}
      onClick={handleClick}>
      Invitation to play sent by {message.sender?.name}
    </div>
  );
};
