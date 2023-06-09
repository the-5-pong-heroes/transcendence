import React, { useContext, useEffect, useState } from 'react';
import { IChannel } from '@/interfaces';
import styles from './ChannelItem.module.scss';
import { ChannelContext } from '@/contexts';
import { useTheme } from "@hooks";

interface ChannelItemProps {
  item: IChannel;
}

export const ChannelItem: React.FC<ChannelItemProps> = ({ item }) => {
  const [preview, setPreview] = useState<string>("");

  const { activeChannel, setActiveChannel } = useContext(ChannelContext);
  const theme = useTheme();

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
    setPreview(str);
  }, [item]);

  return (
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
