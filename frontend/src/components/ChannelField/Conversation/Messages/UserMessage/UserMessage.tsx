import React from "react";

import styles from "./UserMessage.module.scss";

import { type IMessage } from "@/interfaces";

interface IUserMessageProps {
  message: IMessage;
  theme: string;
}

export const UserMessage: React.FC<IUserMessageProps> = ({ message, theme }) => {
  return (
    <div className={`${styles.UserMessage} ${theme === "light" ? styles.UserMessageLight : styles.UserMessageDark}`}>
      <span>{message.sender?.name}</span>
      {message.content}
    </div>
  );
};
