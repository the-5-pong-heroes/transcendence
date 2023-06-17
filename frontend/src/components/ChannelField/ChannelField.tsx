import React, { useContext, useEffect, useState } from "react";

import { ChannelHeader } from "./ChannelHeader";
import { ChannelOptions } from "./ChannelOptions";
import { Conversation } from "./Conversation";
import { ProtectedChannel } from "./ProtectedChannel";
import styles from "./ChannelField.module.scss";

import { ChannelContext } from "@/contexts";
import { useTheme } from "@/hooks";

export const ChannelField: React.FC = () => {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const { activeChannel } = useContext(ChannelContext);

  const theme = useTheme();

  return activeChannel ? (
    <div className={styles.ChannelField}>
      <ChannelHeader setShowOptions={setShowOptions} />
      {activeChannel.messages?.length ? (
        showOptions ? (
          <ChannelOptions />
        ) : (
          <Conversation />
        )
      ) : (
        <ProtectedChannel activeChannel={activeChannel} />
      )}
    </div>
  ) : (
    <div className={`${styles.ChannelField} ${theme === "light" && styles.ChannelFieldLight}`}>
      <div className={styles.ChannelFieldEmpty}>
        <h2>Welcome to the Chat</h2>
        <div>You can search a channel in search bar on the upper left or create a new one with the + button</div>
      </div>
    </div>
  );
};
