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
