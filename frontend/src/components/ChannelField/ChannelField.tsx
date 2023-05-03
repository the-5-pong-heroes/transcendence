import React, { useState } from "react";
import { ChannelHeader } from "./ChannelHeader";
import { ChannelOptions } from "./ChannelOptions";
import { Conversation } from "./Conversation";
import { ProtectedChannel } from "./ProtectedChannel";
import { IChannel } from "../../interfaces";
import styles from "./ChannelField.module.scss";

interface IChannelFieldProps {
  activeChannel: IChannel;
}

export const ChannelField: React.FC<IChannelFieldProps> = ({ activeChannel }) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  return (
    <div className={styles.ChannelField}>
      <ChannelHeader activeChannel={activeChannel} setShowOptions={setShowOptions} />
      {activeChannel.messages ?
        showOptions ?
          <ChannelOptions activeChannel={activeChannel} />
          :
          <Conversation activeChannel={activeChannel} />
        :
        <ProtectedChannel activeChannel={activeChannel} />
      }
    </div>
  );
}
