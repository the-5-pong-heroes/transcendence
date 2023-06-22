import React, { useContext } from "react";

import styles from "./ChannelHeader.module.scss";

import { ChannelContext } from "@/contexts";
import { useUser, useSocket, useTheme } from "@hooks";
import { Setting, Leave } from "@/assets";

interface IChannelHeader {
  setShowOptions: (fct: (opt: boolean) => boolean) => void;
}

export const ChannelHeader: React.FC<IChannelHeader> = ({ setShowOptions }) => {
  const user = useUser();
  const socket = useSocket();
  const { activeChannel } = useContext(ChannelContext);
  if (activeChannel === undefined) {
    throw new Error("Undefined Active Channel");
  }
  const theme = useTheme();

  const leaveChannel = (): void => {
    if (!activeChannel) {
      return;
    }
    socket.emit("quit", { channelId: activeChannel.id, userId: user?.id });
  };

  return (
    <div className={styles.ChannelHeader}>
      <div className={styles.ChannelName}>{activeChannel.name}</div>
      {activeChannel.type !== "DIRECT" ? (
        <div className={`${styles.Options} ${theme === "light" ? styles.OptionsLight : styles.OptionsDark}`}>
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
      ) : (
        <></>
      )}
    </div>
  );
};
