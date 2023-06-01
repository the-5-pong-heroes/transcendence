import React from "react";

import styles from "./ChannelHeader.module.scss";

import { type IChannel } from "@/interfaces";
import { Setting, Leave } from "@assets";
import { useUser, useSocketContext } from "@hooks";
import { type SocketParameters } from "@types";

interface IChannelHeader {
  activeChannel: IChannel;
  setShowOptions: (fct: (opt: boolean) => boolean) => void;
}

export const ChannelHeader: React.FC<IChannelHeader> = ({ activeChannel, setShowOptions }) => {
  const { user } = useUser();
  const { socket }: SocketParameters = useSocketContext();

  const leaveChannel = (): void => {
    if (!activeChannel) {
      return;
    }
    socket?.emit("quit", { channelId: activeChannel.id, userId: user?.id });
  };

  return (
    <div className={styles.ChannelHeader}>
      <div className={styles.ChannelName}>{activeChannel?.name}</div>
      <div className={styles.Options}>
        <button
          className={styles.Button}
          title="Settings"
          onClick={() => setShowOptions((opt) => !opt)}
          style={{ backgroundImage: `url(${Setting})` }}
          disabled={!activeChannel}
        />
        <button
          className={styles.Button}
          title="Leave"
          onClick={leaveChannel}
          style={{ backgroundImage: `url(${Leave})` }}
          disabled={!activeChannel}
        />
      </div>
    </div>
  );
};
