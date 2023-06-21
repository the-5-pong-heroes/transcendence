import React, { Dispatch, SetStateAction, useContext, useEffect } from "react";

import { CreateChat } from "./CreateChat";
import { SearchBar } from "./SearchBar";
import { ChannelItem } from "./ChannelItem";
import styles from "./ChannelList.module.scss";

import { useUser, useTheme, useSocket } from "@hooks";
import { ChannelContext } from "@/contexts";

interface IChannelList {
  setShowOptions: Dispatch<SetStateAction<boolean>>;
}

export const ChannelList: React.FC<IChannelList> = ({ setShowOptions }) => {
  const user = useUser();
  const theme = useTheme();
  const socket = useSocket();
  const { channels } = useContext(ChannelContext);

  const stopOutterScroll = (event: any) => {
    const container = event.target.closest(".container");
    container.style.overflow = "hidden";
  };

  const enableOutterScroll = (event: any) => {
    const container = event.target.closest(".container");
    container.style.overflow = "";
  };

  useEffect(() => {
    channels.map((channel) => {
      socket.emit("join", channel.id);
    });

    return () => {
      channels.map((channel) => {
        socket.emit("leave", channel.id);
      });
    };
  }, [channels, socket]);

  return (
    <div onMouseEnter={stopOutterScroll} onMouseLeave={enableOutterScroll} className={styles.ChannelList}>
      <div className={`${styles.Header} ${theme === "light" ? styles.HeaderLight : styles.HeaderDark}`}>
        <div className={styles.Top}>
          <div className={styles.Title}>{user?.name}</div>
          <CreateChat />
        </div>
        <SearchBar />
      </div>
      {channels?.map((item, index) => (
        <ChannelItem key={index} item={item} setShowOptions={setShowOptions} />
      ))}
    </div>
  );
};
