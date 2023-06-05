<<<<<<< HEAD
import React, { useEffect, useState } from "react";

import styles from "./Chat.module.scss";

import { ChannelList, ChannelField } from "@/components";
import { type IChannel } from "@/interfaces";
import { useSocketContext } from "@hooks";
import { type SocketParameters } from "@types";
import { BASE_URL } from "@/constants";
=======
import React from 'react';
import { ChannelProvider, UserProvider } from '@/contexts';
import { ChannelList, ChannelField } from '../../components'
import styles from './Chat.module.scss';
>>>>>>> master

interface IChatProps {
  chatRef: React.RefObject<HTMLDivElement>;
}

export const Chat: React.FC<IChatProps> = ({ chatRef }) => {
<<<<<<< HEAD
  const [activeChannel, setActiveChannel] = useState<IChannel | null>(null);
  const [channels, setChannels] = useState<IChannel[]>([]);
  const { socket }: SocketParameters = useSocketContext();

  const fetchData = async (changeChannel = true): Promise<void> => {
    const response = await fetch(`${BASE_URL}/chat`, {
      credentials: "include",
    });
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as IChannel[];
    setChannels(data);
    if (changeChannel) {
      setActiveChannel(data[0]);
    } else if (activeChannel && data.find((channel: IChannel) => channel.id === activeChannel.id)) {
      setActiveChannel(data.find((channel: IChannel) => channel.id === activeChannel?.id) || null);
    } else {
      setActiveChannel(data[0]);
    }
  };

  useEffect(() => {
    fetchData().catch((error) => {
      // Handle the error here
      console.error(error);
    });
  }, []);

  useEffect(() => {
    socket?.on("updateChannels", fetchData);

    return () => {
      socket?.off("updateChannels", fetchData);
    };
  }, [activeChannel, socket]);

  useEffect(() => {
    channels.map((channel) => {
      socket?.emit("join", channel.id);
    });

    return () => {
      channels.map((channel) => {
        socket?.emit("leave", channel.id);
      });
    };
  }, [channels, socket]);

  return (
    <div ref={chatRef} className={styles.Chat}>
      {activeChannel !== null && <ChannelList channels={channels} setActiveChannel={setActiveChannel} />}
      {activeChannel && <ChannelField activeChannel={activeChannel} />}
    </div>
=======

  return (
    <UserProvider>
      <ChannelProvider>
        <div ref={chatRef} className={styles.Chat}>
          <div className={styles.ChatWindow}>
            <ChannelList />
            <ChannelField />
          </div>
        </div>
      </ChannelProvider>
    </UserProvider>
>>>>>>> master
  );
};

