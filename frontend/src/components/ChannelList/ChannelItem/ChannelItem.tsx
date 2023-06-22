import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

import styles from "./ChannelItem.module.scss";

import { type IChannel } from "@/interfaces";
import { ChannelContext } from "@/contexts";
import { useTheme } from "@hooks";

interface IChannelItemProps {
  item: IChannel;
  setShowOptions: Dispatch<SetStateAction<boolean>>;
}

export const ChannelItem: React.FC<IChannelItemProps> = ({ item, setShowOptions }) => {
  const [preview, setPreview] = useState<string>("");

  const { activeChannel, setActiveChannel } = useContext(ChannelContext);
  const theme = useTheme();

  useEffect(() => {
    if (!item.messages || !item.messages[0]) {
      if (item.type === "PROTECTED") {
        return setPreview("Password required");
      }

      return setPreview("");
    }
    const lastMessage = item.messages[0];
    let str = "";
    if (lastMessage.sender?.name && lastMessage.content.substring(0, 13) !== "/InviteToPlay") {
      str += lastMessage.sender.name + ": ";
    }
    if (lastMessage.sender?.name && lastMessage.content.substring(0, 13) === "/InviteToPlay") {
      str += lastMessage.sender.name + " sent an invite to play";
    } else {
      str += lastMessage.content;
    }
    if (str.length > 48) {
      str = str.substring(0, 46) + "...";
    }
    setPreview(str);
  }, [item]);

  const handleClick = (): void => {
    if (setActiveChannel) {
      setActiveChannel(item);
    }
    setShowOptions(false);
  };

  return (
    <div
      className={`
        ${styles.ChannelItem}
        ${theme === "light" ? styles.ChannelItemLight : styles.ChannelItemDark}
        ${activeChannel?.id === item.id && styles.ActiveItem}
      `}
      onClick={handleClick}>
      <div className={styles.Name}>{item.name}</div>
      <div className={styles.Preview}>{preview}</div>
    </div>
  );
};
