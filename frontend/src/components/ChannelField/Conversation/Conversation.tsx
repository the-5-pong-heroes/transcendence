import React from "react";

import { Messages } from "./Messages";
import { ConversationForm } from "./ConversationForm";
import styles from "./Conversation.module.scss";

import { type IChannel } from "src/interfaces";

interface IConversationProps {
  activeChannel: IChannel;
}

export const Conversation: React.FC<IConversationProps> = ({ activeChannel }) => {
  return (
    <div className={styles.Conversation}>
      <Messages activeChannel={activeChannel} />
      <ConversationForm activeChannel={activeChannel} />
    </div>
  );
};
