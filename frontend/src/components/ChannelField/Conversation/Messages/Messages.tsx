import React, { useEffect, useState } from "react";

import styles from "./Messages.module.scss";

import { type IChannel } from "@/interfaces";
import { useUser, useSocketContext, useAppContext } from "@hooks";
import type { SocketParameters, AppContextParameters } from "@types";
import { ResponseError } from "@/helpers";
import { BASE_URL } from "@/constants";

interface IMessagesProps {
  activeChannel: IChannel;
}

interface IMessage {
  content: string;
  senderId?: string;
  sender?: {
    name: string;
  };
  channelId: string;
}

export const Messages: React.FC<IMessagesProps> = ({ activeChannel }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { user } = useUser();
  const { socket }: SocketParameters = useSocketContext();
  const { theme }: AppContextParameters = useAppContext();

  useEffect(() => {
    const handleMessage = (message: IMessage): void => {
      if (message.channelId === activeChannel?.id) {
        setMessages((prev: IMessage[]) => [message, ...prev]);
      }
    };

    socket?.on("message", handleMessage);

    return () => {
      socket?.off("message", handleMessage);
    };
  }, [activeChannel, socket]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const response = await fetch(`${BASE_URL}/chat/${activeChannel.id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new ResponseError("Failed on fetch messages request", response);
      }
      const data = (await response.json()) as IMessage[];
      setMessages(data);
    };

    fetchData().catch((error) => {
      // Handle the error here
      console.error(error);
    });
  }, [activeChannel]);

  return (
    <div className={`${styles.Messages} ${theme === "light" ? styles.MessagesLight : styles.MessagesDark}`}>
      {messages.map((message, index) => {
        return (
          <div
            key={index}
            className={`${styles.Message} ${
              message.senderId ? (message.senderId == user?.id ? styles.Mine : "") : styles.Server
            }`}>
            <span>{message.sender?.name}</span>
            {message.content}
          </div>
        );
      })}
    </div>
  );
};
