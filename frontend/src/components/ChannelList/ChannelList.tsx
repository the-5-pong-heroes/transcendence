<<<<<<< HEAD
import React from "react";

import { CreateChat } from "./CreateChat";
import { SearchBar } from "./SearchBar";
import { ChannelItem } from "./ChannelItem";
import styles from "./ChannelList.module.scss";

import { type IChannel } from "@/interfaces";
import { useUser, useAppContext } from "@hooks";
import type { AppContextParameters } from "@types";

interface IChannelListProps {
  channels: IChannel[];
  setActiveChannel: (activeChannel: IChannel) => void;
}

export const ChannelList: React.FC<IChannelListProps> = ({ channels, setActiveChannel }) => {
  const { user } = useUser();
  const { theme }: AppContextParameters = useAppContext();

  return (
    <div className={styles.ChannelList}>
      <div className={`${styles.Header} ${theme === "light" ? styles.HeaderLight : styles.HeaderDark}`}>
        <div className={styles.Top}>
          <div className={styles.Username}>{user?.name}</div>
          <CreateChat />
        </div>
        <div className={styles.Title}>Chat 😺</div>
        <SearchBar />
      </div>
      {channels?.map((item, index) => (
        <ChannelItem key={index} item={item} setActiveChannel={setActiveChannel} />
      ))}
    </div>
  );
};
=======
import React, { useContext, useEffect } from 'react';
import { AppContext, ChannelContext, UserContext, UserContextType } from '@/contexts';
import { socket } from '@/socket';
import { CreateChat } from './CreateChat';
import { SearchBar } from './SearchBar';
import { ChannelItem } from './ChannelItem';
import styles from './ChannelList.module.scss';

export const ChannelList: React.FC = () => {
  const { user } = useContext(UserContext) as UserContextType;
  const { channels } = useContext(ChannelContext);
  const appContext = useContext(AppContext);
  if (appContext === undefined) {
    throw new Error("Undefined AppContext");
  }
  const { theme } = appContext;

  const stopOutterScroll = (event: any) => {
    const container = event.target.closest('.container');
    container.style.overflow = 'hidden';
  }

  const enableOutterScroll = (event: any) => {
    const container = event.target.closest('.container');
    container.style.overflow = '';
  }

  useEffect(() => {
    channels.map(channel => {
      socket.emit('join', channel.id);
    });

    return () => {
      channels.map(channel => {
        socket.emit('leave', channel.id);
      });
    }
  }, [channels]);
   
  return (
    <div
      onMouseEnter={stopOutterScroll}
      onMouseLeave={enableOutterScroll}
      className={styles.ChannelList}
    >
      <div className={`${styles.Header} ${theme === "light" ? styles.HeaderLight : styles.HeaderDark}`}>
        <div className={styles.Top}>
          <div className={styles.Title}>
            {user.name}
          </div>
          <CreateChat />
        </div>
        <SearchBar />
      </div>
      {
        channels?.map((item, index) => (<ChannelItem key={index} item={item}/>))
      }
    </div>
  );
}
>>>>>>> master
