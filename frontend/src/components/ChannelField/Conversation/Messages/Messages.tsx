import React, { useContext, useEffect, useState } from 'react';
import { ChannelContext, UserContext, UserContextType } from '@/contexts';
// import { socket } from '@/socket';
import { useUser, useSocket, useTheme } from "@hooks";
import { IMessage } from '@/interfaces';
import { ServerMessage } from './ServerMessage';
import { UserMessage } from './UserMessage';
import { OtherMessage } from './OtherMessage';
import { ResponseError } from "@/helpers";
import styles from './Messages.module.scss';

export const Messages: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [showOptions, setShowOptions] = useState<number>(-1);

  // const { user } = useContext(UserContext) as UserContextType;
  const user = useUser();
  const socket = useSocket();
  const theme = useTheme();

  const { activeChannel } = useContext(ChannelContext);
  if (activeChannel === undefined) throw new Error("Undefined Active Channel");

  useEffect(() => {
    const fetchData = async () => {
      // const token = localStorage.getItem('access_token');
      // if (!token || !activeChannel) return setMessages([]);
      if (!activeChannel) return setMessages([]);
      // const	config = { headers: { 'Authorization': token }};
      const response = await fetch(`http://localhost:3000/chat/${activeChannel.id}`, { credentials: "include" });
      // if (!response.ok) return console.log(response);
      if (!response.ok) {
        throw new ResponseError("Failed on fetch channels request", response);
      }
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
            message.senderId === user?.id ?
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
