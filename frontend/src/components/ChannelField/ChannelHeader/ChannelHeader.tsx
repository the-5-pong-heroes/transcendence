<<<<<<< HEAD
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
=======
import React, { useContext } from "react";
import { AppContext, ChannelContext, UserContext, UserContextType } from "@/contexts";
import { socket } from "@/socket";
import { Setting, Leave } from '@/assets';
import styles from "./ChannelHeader.module.scss";

interface IChannelHeader {
  setShowOptions: (fct: (opt: boolean) => boolean) => void;
}

export const ChannelHeader: React.FC<IChannelHeader> = ({ setShowOptions }) => {
  const { user } = useContext(UserContext) as UserContextType;
  const { activeChannel } = useContext(ChannelContext);
  if (activeChannel === undefined) throw new Error("Undefined Active Channel");
  const appContext = useContext(AppContext);
  if (appContext === undefined) throw new Error("Undefined AppContext");
  const { theme } = appContext;

  const leaveChannel = async () => {
    const token = localStorage.getItem('access_token');
    if (!token || !activeChannel) return;
    socket.emit('quit', { channelId: activeChannel.id, userId: user.id });
  }

  return (
    <div className={styles.ChannelHeader}>
      <div className={styles.ChannelName}>
        {activeChannel.name}
      </div>
        {activeChannel.type !== "DIRECT" ?
        <div className={`${styles.Options} ${theme === "light" ? styles.OptionsLight : styles.OptionsDark}`}>
          <button
            className={styles.Button}
            title="Settings"
            onClick={() => setShowOptions(opt => (!opt))}
            style={{backgroundImage: `url(${Setting})`}}
            disabled={!activeChannel}
          />
          <button
            className={styles.Button}
            title="Leave"
            onClick={leaveChannel}
            style={{backgroundImage: `url(${Leave})`}}
            disabled={!activeChannel}
          />
        </div>
        :
        <></>
        }
    </div>
  );
}
>>>>>>> master
