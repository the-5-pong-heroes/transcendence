import React from 'react';
import { Messages } from './Messages';
import { ConversationForm } from './ConversationForm';
import { IChannel } from 'src/interfaces';
import styles from './Conversation.module.scss';

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
}
