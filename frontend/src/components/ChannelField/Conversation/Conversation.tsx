<<<<<<< HEAD
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
=======
import React from 'react';
import { Messages } from './Messages';
import { ConversationForm } from './ConversationForm';
import styles from './Conversation.module.scss';

export const Conversation: React.FC = () => {

  const stopOutterScroll = (event: any) => {
    const container = event.target.closest('.container');
    container.style.overflow = 'hidden';
  }

  const enableOutterScroll = (event: any) => {
    const container = event.target.closest('.container');
    container.style.overflow = '';
  }

  return (
    <div
      onMouseEnter={stopOutterScroll}
      onMouseLeave={enableOutterScroll}
      className={styles.Conversation}
    >
      <Messages />
      <ConversationForm />
    </div>
  );
}
>>>>>>> master
