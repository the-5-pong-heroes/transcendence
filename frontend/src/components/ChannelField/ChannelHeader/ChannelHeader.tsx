import React, { useContext } from "react";
import { UserContext, UserContextType } from "../../../contexts";
import { IChannel } from "../../../interfaces";
import { socket } from "../../../socket";
import { Setting, Leave } from '../../../assets';
import styles from "./ChannelHeader.module.scss";

interface IChannelHeader {
  activeChannel: IChannel;
  setShowOptions: (fct: (opt: boolean) => boolean) => void;
}

export const ChannelHeader: React.FC<IChannelHeader> = ({ activeChannel, setShowOptions }) => {
  const { user } = useContext(UserContext) as UserContextType;

  const leaveChannel = async () => {
    const token = localStorage.getItem('access_token');
    if (!token || !activeChannel) return;
    socket.emit('quit', { channelId: activeChannel.id, userId: user.id });
  }

  return (
    <div className={styles.ChannelHeader}>
      <div className={styles.ChannelName}>
        {activeChannel?.name}
      </div>
      <div className={styles.Options}>
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
    </div>
  );
}
