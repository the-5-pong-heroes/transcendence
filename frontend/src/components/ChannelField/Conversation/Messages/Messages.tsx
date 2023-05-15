import React, { useContext, useEffect, useState } from 'react';
import { AppContext, UserContext, UserContextType } from '../../../../contexts';
import { IChannel } from '../../../../interfaces';
import { socket } from '../../../../socket';
import styles from './Messages.module.scss';

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
  const { user } = useContext(UserContext) as UserContextType;
  const appContext = useContext(AppContext);
  if (appContext === undefined) {
    throw new Error("Undefined AppContext");
  }
  const { theme } = appContext;

  useEffect(() => {
    const handleMessage = (message: IMessage) => {
      if (message.channelId === activeChannel?.id)
        setMessages((prev: IMessage[]) => ([ message, ...prev ]));
    }

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    }
  }, [activeChannel]);
  
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token || !activeChannel) return setMessages([]);
      const	config = { headers: { 'Authorization': token }};
      const response = await fetch(`http://localhost:3000/chat/${activeChannel.id}`, config);
      if (!response.ok)
      {
        console.log(response);
        return;
      }
      const data = await response.json();
      setMessages(data);
    }

    fetchData();
  }, [activeChannel]);

  return (
    <div className={`${styles.Messages} ${theme === "light" ? styles.MessagesLight : styles.MessagesDark}`}>
      {
      messages.map((message, index) => {
        return (
          <div
            key={index}
            className={`${styles.Message} ${message.senderId ? (message.senderId == user.id ? styles.Mine : "") : styles.Server}`}
          >
            <span>{message.sender?.name}</span>
            {message.content}
          </div>
        );
      })
      }
    </div>
  );
}
