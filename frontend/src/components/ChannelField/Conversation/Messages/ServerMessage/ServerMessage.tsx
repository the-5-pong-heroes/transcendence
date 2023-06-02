import React from "react";
import { IMessage } from "@/interfaces";
import styles from "./ServerMessage.module.scss";

interface IServerMessageProps {
  message: IMessage;
  theme: string;
}

export const ServerMessage: React.FC<IServerMessageProps> = ({ message, theme }) => {
  return (
    <div className={`${styles.ServerMessage} ${theme === "light" ? styles.ServerMessageLight : styles.ServerMessageDark}`}>
      {message.content}
    </div>
  );
}
