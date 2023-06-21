import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

import { ChannelHeader } from "./ChannelHeader";
import { ChannelOptions } from "./ChannelOptions";
import { Conversation } from "./Conversation";
import { ProtectedChannel } from "./ProtectedChannel";
import styles from "./ChannelField.module.scss";

import { ChannelContext } from "@/contexts";
import { useTheme } from "@/hooks";

interface IChannelField {
  showOptions: boolean;
  setShowOptions: Dispatch<SetStateAction<boolean>>;
}

export const ChannelField: React.FC<IChannelField> = ({ showOptions, setShowOptions }) => {
  const { activeChannel } = useContext(ChannelContext);

  const theme = useTheme();

  return activeChannel ? (
    <div className={styles.ChannelField}>
      <ChannelHeader setShowOptions={setShowOptions} />
	  {activeChannel.type === "PROTECTED" && !activeChannel.messages?.length ? (
        <ProtectedChannel activeChannel={activeChannel} />
      ) : (
        showOptions ? (
          <ChannelOptions />
        ) : (
          <Conversation />
        )
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
