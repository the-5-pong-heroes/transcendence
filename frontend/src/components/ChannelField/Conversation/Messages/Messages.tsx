import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

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
  const { data } = useQuery<IMessage[] | null>(
    "messages_query",
    async (): Promise<IMessage[] | null> => fetchMessages()
  );

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

  async function fetchMessages(): Promise<IMessage[] | null> {
    if (!activeChannel) {
      setMessages([]);

      return null;
    }
    const response = await fetch(`${BASE_URL}/chat/${activeChannel.id}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new ResponseError("Failed on get messages request", response);
    }
    const data = (await response.json()) as IMessage[];
    setMessages(data);

    return data;
  }

  // useEffect(() => {
  //   const fetchData = async (): Promise<void> => {
  //     const token = localStorage.getItem("access_token");
  //     if (!token || !activeChannel) {
  //       return setMessages([]);
  //     }
  //     const config = { headers: { Authorization: token } };
  //     const response = await fetch(`${BASE_URL}/chat/${activeChannel.id}`, config);
  //     if (!response.ok) {
  //       console.log(response);

  //       return;
  //     }
  //     const data = (await response.json()) as IMessage[];
  //     setMessages(data);
  //   };

  //   fetchData();
  // }, [activeChannel]);

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
