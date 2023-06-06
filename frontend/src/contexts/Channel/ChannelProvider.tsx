import React, { useState, useEffect } from "react";
import { ChannelContext } from "./ChannelContext";
// import { socket } from "@/socket";
import { useSocketContext } from "@hooks";
import { type SocketParameters } from "@types";
import { IChannel } from "@/interfaces";

interface ProviderParameters {
  children: React.ReactNode;
}

export const ChannelProvider: React.FC<ProviderParameters> = ({ children }) => {
  const [activeChannel, setActiveChannel] = useState<IChannel | undefined>(undefined);
  const [channels, setChannels] = useState<IChannel[]>([]);
  const { socket }: SocketParameters = useSocketContext();

  const fetchData = async (changeChannel: boolean = true) => {
    // const	token = localStorage.getItem('access_token');
    // if (!token) return;
    // const	config = { headers: { 'Authorization': token }};
    const config = { credentials: "include" as RequestCredentials };
    const response = await fetch('http://localhost:3000/chat', config);
    if (!response.ok) return;
    const data = (await response.json()) as IChannel[];
    setChannels(data);
    if (changeChannel)
      setActiveChannel(data[0]);
    else if (activeChannel && data.find((channel: IChannel) => channel.id === activeChannel.id))
      setActiveChannel(data.find((channel: IChannel) => channel.id === activeChannel?.id) || undefined)
    else
      setActiveChannel(data[0]);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    socket?.on('updateChannels', fetchData);
    return () => {
      socket?.off('updateChannels', fetchData);
    }
  }, [activeChannel, socket]);

  return <ChannelContext.Provider value={{channels, activeChannel, setActiveChannel}}>{children}</ChannelContext.Provider>;
};
