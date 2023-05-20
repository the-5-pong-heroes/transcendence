import React, { useEffect, useState } from 'react';
import { ChannelType } from "./ChannelType";
import { ChannelUser } from "./ChannelUser";
import { ChannelBan } from "./ChannelBan";
import { IChannel, IChannelBan } from '../../../interfaces';
import styles from './ChannelOptions.module.scss';

interface IChannelOptionsProps {
  activeChannel: IChannel;
}

interface IReturnMessage {
  error: boolean;
  message: string;
}

export const ChannelOptions: React.FC<IChannelOptionsProps> = ({ activeChannel }) => {
  const [returnMessage, setReturnMessage] = useState<IReturnMessage>({ error: true, message: "" });

  useEffect(() => {
    setReturnMessage((prev) => ({ ...prev, message: "" }));
  }, [activeChannel]);

  return (
    <div className={styles.ChannelOptions}>
      <ChannelType activeChannel={activeChannel} setReturnMessage={setReturnMessage}/>
      <ChannelUser users={activeChannel.users} />
      <ChannelBan activeChannel={activeChannel} banned={activeChannel.banned} />
    </div>
  );
}
