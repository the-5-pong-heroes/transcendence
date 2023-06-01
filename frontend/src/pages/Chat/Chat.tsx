import React, { useEffect, useState } from "react";

import styles from "./Chat.module.scss";

import { ChannelList, ChannelField } from "@/components";
import { type IChannel } from "@/interfaces";
import { useSocketContext } from "@hooks";
import { type SocketParameters } from "@types";
import { BASE_URL } from "@/constants";

interface IChatProps {
  chatRef: React.RefObject<HTMLDivElement>;
}

export const Chat: React.FC<IChatProps> = ({ chatRef }) => {
  const [activeChannel, setActiveChannel] = useState<IChannel | null>(null);
  const [channels, setChannels] = useState<IChannel[]>([]);
  const { socket }: SocketParameters = useSocketContext();

  const fetchData = async (changeChannel = true): Promise<void> => {
    const response = await fetch(`${BASE_URL}/chat`, {
      credentials: "include",
    });
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as IChannel[];
    setChannels(data);
    if (changeChannel) {
      setActiveChannel(data[0]);
    } else if (activeChannel && data.find((channel: IChannel) => channel.id === activeChannel.id)) {
      setActiveChannel(data.find((channel: IChannel) => channel.id === activeChannel?.id) || null);
    } else {
      setActiveChannel(data[0]);
    }
  };

  useEffect(() => {
    fetchData().catch((error) => {
      // Handle the error here
      console.error(error);
    });
  }, []);

  useEffect(() => {
    socket?.on("updateChannels", fetchData);

    return () => {
      socket?.off("updateChannels", fetchData);
    };
  }, [activeChannel, socket]);

  useEffect(() => {
    channels.map((channel) => {
      socket?.emit("join", channel.id);
    });

    return () => {
      channels.map((channel) => {
        socket?.emit("leave", channel.id);
      });
    };
  }, [channels, socket]);

  return (
    <div ref={chatRef} className={styles.Chat}>
      {activeChannel !== null && <ChannelList channels={channels} setActiveChannel={setActiveChannel} />}
      {activeChannel && <ChannelField activeChannel={activeChannel} />}
    </div>
  );
};
