import React, { useEffect, useState } from 'react';
import { UserProvider } from '@/contexts';
import { ChannelList, ChannelField } from '../../components'
import { socket } from '../../socket';
import { IChannel } from '../../interfaces';
import styles from './Chat.module.scss';

interface IChatProps {
  chatRef: React.RefObject<HTMLDivElement>;
}

export const Chat: React.FC<IChatProps> = ({ chatRef }) => {
  const [activeChannel, setActiveChannel] = useState<IChannel | null>(null);
  const [channels, setChannels] = useState<IChannel[]>([]);
  
  const fetchData = async (changeChannel: boolean = true) => {
    const	token = localStorage.getItem('access_token');
    if (!token) return;
    const	config = { headers: { 'Authorization': token }};
    const response = await fetch('http://localhost:3000/chat', config);
    if (!response.ok) return;
    const data = await response.json();
    setChannels(data);
    if (changeChannel)
      setActiveChannel(data[0]);
    else if (activeChannel && data.find((channel: IChannel) => channel.id === activeChannel.id))
      setActiveChannel(data.find((channel: IChannel) => channel.id === activeChannel?.id))
    else
      setActiveChannel(data[0]);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    socket.on('updateChannels', fetchData);
    return () => {
      socket.off('updateChannels', fetchData);
    }
  }, [activeChannel]);

  useEffect(() => {
    channels.map(channel => {
      socket.emit('join', channel.id);
    });

    return () => {
      channels.map(channel => {
        socket.emit('leave', channel.id);
      });
    }
  }, [channels]);

  return (
    <UserProvider>
      <div ref={chatRef} className={styles.Chat}>
        {activeChannel !== null && <ChannelList channels={channels} setActiveChannel={setActiveChannel} />}
        {activeChannel && <ChannelField activeChannel={activeChannel} />}
      </div>
    </UserProvider>
  );
};

