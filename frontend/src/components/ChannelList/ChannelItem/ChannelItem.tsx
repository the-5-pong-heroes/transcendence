<<<<<<< HEAD
import React, { useEffect, useState } from "react";

import styles from "./ChannelItem.module.scss";

import type { IChannel } from "@/interfaces";

interface ChannelItemProps {
  item: IChannel;
  setActiveChannel: (activeChannel: IChannel) => void;
}

export const ChannelItem: React.FC<ChannelItemProps> = ({ item, setActiveChannel }) => {
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    // if (!item.messages || !item.messages[0]) {
    if (!item.messages?.[0]) {
      return setPreview("Password required");
    }
    const lastMessage = item.messages[0];
    let str = "";
    if (lastMessage.senderId) {
      str += lastMessage.senderId + ": ";
    }
    str += lastMessage.content;
    if (str.length > 48) {
      str = str.substring(0, 46) + "...";
    }
=======
import React, { useContext, useEffect, useState } from 'react';
import { IChannel } from '@/interfaces';
import styles from './ChannelItem.module.scss';
import { AppContext, ChannelContext } from '@/contexts';

interface ChannelItemProps {
  item: IChannel;
}

export const ChannelItem: React.FC<ChannelItemProps> = ({ item }) => {
  const [preview, setPreview] = useState<string>("");

  const { activeChannel, setActiveChannel } = useContext(ChannelContext);
  const appContext = useContext(AppContext);
  if (appContext === undefined) throw new Error("Undefined appContext");
  const { theme } = appContext;

  useEffect(() => {
    if (!item.messages || !item.messages[0]) {
      if (item.type === "PROTECTED") return setPreview("Password required");
      return setPreview("");
    }
    const lastMessage = item.messages[0];
    let str = "";
    if (lastMessage.sender?.name)
      str += lastMessage.sender.name + ": ";
    str += lastMessage.content;
    if (str.length > 48)
      str = str.substring(0, 46) + "...";
>>>>>>> master
    setPreview(str);
  }, [item]);

  return (
<<<<<<< HEAD
    <div className={styles.ChannelItem} onClick={() => setActiveChannel(item)}>
      <div className={styles.Name}>{item.name}</div>
      <div className={styles.Preview}>{preview}</div>
    </div>
  );
};
=======
    <div
      className={`
        ${styles.ChannelItem}
        ${theme === "light" ? styles.ChannelItemLight : styles.ChannelItemDark}
        ${activeChannel?.id === item.id && styles.ActiveItem}
      `}
      onClick={() => setActiveChannel && setActiveChannel(item)}
    >
      <div className={styles.Name}>
        {item.name}
      </div>
      <div className={styles.Preview}>
        {preview}
      </div>
    </div>
  );
}
>>>>>>> master
