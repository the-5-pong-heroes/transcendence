<<<<<<< HEAD
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
=======
import React, { useContext, useEffect, useState } from 'react';
import { AppContext, ChannelContext, UserContext, UserContextType } from '@/contexts';
import { socket } from '@/socket';
import { IMessage } from '@/interfaces';
import { ServerMessage } from './ServerMessage';
import { UserMessage } from './UserMessage';
import { OtherMessage } from './OtherMessage';
import styles from './Messages.module.scss';

export const Messages: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [showOptions, setShowOptions] = useState<number>(-1);

  const { user } = useContext(UserContext) as UserContextType;
  const { activeChannel } = useContext(ChannelContext);
  if (activeChannel === undefined) throw new Error("Undefined Active Channel");
  const appContext = useContext(AppContext);
  if (appContext === undefined) throw new Error("Undefined AppContext");
  const { theme } = appContext;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token || !activeChannel) return setMessages([]);
      const	config = { headers: { 'Authorization': token }};
      const response = await fetch(`http://localhost:3000/chat/${activeChannel.id}`, config);
      if (!response.ok) return console.log(response);
      const data = await response.json();
      setMessages(data);
    }

    fetchData();

    const handleMessage = (message: IMessage) => {
      if (message.channelId === activeChannel.id)
        setMessages((prev: IMessage[]) => ([ message, ...prev ]));
    }

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    }
  }, [activeChannel]);

  return (
    <div className={styles.Messages}>
      {
      messages.map((message, index) => {
        return (
          message.senderId ?
            message.senderId === user.id ?
            <UserMessage key={index} message={message} theme={theme} />
            :
            <OtherMessage
              key={index}
              message={message}
              theme={theme}
              showOptions={showOptions === index}
              setShowOptions={() => showOptions === index ? setShowOptions(-1) : setShowOptions(index)}
            />
          :
          <ServerMessage key={index} message={message} theme={theme} />
        );
      })
      }
    </div>
  );
}
>>>>>>> master
