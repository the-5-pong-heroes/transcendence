import React, { useContext } from 'react';
import { AppContext, UserContext, UserContextType } from '../../contexts';
import { CreateChat } from './CreateChat';
import { SearchBar } from './SearchBar';
import { ChannelItem } from './ChannelItem';
import { IChannel } from '../../interfaces';
import styles from './ChannelList.module.scss';

interface IChannelListProps {
  channels: IChannel[];
  setActiveChannel: (activeChannel: IChannel) => void;
}

export const ChannelList: React.FC<IChannelListProps> = ({ channels, setActiveChannel }) => {
  const { user } = useContext(UserContext) as UserContextType;
  const appContext = useContext(AppContext);
  if (appContext === undefined) {
    throw new Error("Undefined AppContext");
  }
  const { theme } = appContext;
  
  return (
    <div className={styles.ChannelList}>
      <div className={`${styles.Header} ${theme === "light" ? styles.HeaderLight : styles.HeaderDark}`}>
        <div className={styles.Top}>
          <div className={styles.Username}>
            {user.name}
          </div>
          <CreateChat />
        </div>
        <div className={styles.Title}>
          Chat 😺
        </div>
        <SearchBar />
      </div>
      {
        channels?.map((item, index) => (<ChannelItem key={index} item={item} setActiveChannel={setActiveChannel}/>))
      }
    </div>
  );
}
