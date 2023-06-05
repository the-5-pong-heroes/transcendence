<<<<<<< HEAD
import React, { useState } from "react";

import { type IChannel } from "../../interfaces";

=======
import React, { useContext, useState } from "react";
import { ChannelContext } from "@/contexts";
>>>>>>> master
import { ChannelHeader } from "./ChannelHeader";
import { ChannelOptions } from "./ChannelOptions";
import { Conversation } from "./Conversation";
import { ProtectedChannel } from "./ProtectedChannel";
import styles from "./ChannelField.module.scss";

<<<<<<< HEAD
interface IChannelFieldProps {
  activeChannel: IChannel;
}

export const ChannelField: React.FC<IChannelFieldProps> = ({ activeChannel }) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  return (
    <div className={styles.ChannelField}>
      <ChannelHeader activeChannel={activeChannel} setShowOptions={setShowOptions} />
      {activeChannel.messages ? (
        showOptions ? (
          <ChannelOptions activeChannel={activeChannel} />
        ) : (
          <Conversation activeChannel={activeChannel} />
        )
      ) : (
        <ProtectedChannel activeChannel={activeChannel} />
      )}
    </div>
  );
};
=======
export const ChannelField: React.FC = () => {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const { activeChannel } = useContext(ChannelContext);

  return (
    activeChannel ?
    <div className={styles.ChannelField}>
      <ChannelHeader setShowOptions={setShowOptions} />
      {activeChannel.messages ?
        showOptions ?
          <ChannelOptions />
          :
          <Conversation />
        :
        <ProtectedChannel activeChannel={activeChannel} />
      }
    </div>
    :
    <div className={styles.ChannelField}>
      <h2>Welcome to the Chat</h2>
      <div>You can search a channel in search bar on the upper left or create a new one with the + button</div>
    </div>
  );
}
>>>>>>> master
