import React from 'react';
import { ChannelProvider, UserProvider } from '@/contexts';
import { ChannelList, ChannelField } from '../../components'
import styles from './Chat.module.scss';

interface IChatProps {
  chatRef: React.RefObject<HTMLDivElement>;
}

export const Chat: React.FC<IChatProps> = ({ chatRef }) => {

  return (
    <UserProvider>
      <ChannelProvider>
        <div ref={chatRef} className={styles.Chat}>
          <div className={styles.ChatWindow}>
            <ChannelList />
            <ChannelField />
          </div>
        </div>
      </ChannelProvider>
    </UserProvider>
  );
};

