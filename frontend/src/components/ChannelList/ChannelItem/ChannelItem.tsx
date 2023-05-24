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
    setPreview(str);
  }, [item]);

  return (
    <div className={styles.ChannelItem} onClick={() => setActiveChannel(item)}>
      <div className={styles.Name}>{item.name}</div>
      <div className={styles.Preview}>{preview}</div>
    </div>
  );
};
