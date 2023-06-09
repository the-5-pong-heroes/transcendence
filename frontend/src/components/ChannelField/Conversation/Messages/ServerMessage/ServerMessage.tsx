import React from "react";

import styles from "./ServerMessage.module.scss";

import { type IMessage } from "@/interfaces";

interface IServerMessageProps {
  message: IMessage;
  theme: string;
}

export const ServerMessage: React.FC<IServerMessageProps> = ({ message, theme }) => {
  return (
    <div
      className={`${styles.ServerMessage} ${theme === "light" ? styles.ServerMessageLight : styles.ServerMessageDark}`}>
      {message.content}
    </div>
  );
};
