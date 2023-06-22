import React, { useContext, useEffect, useState } from "react";

import { ServerMessage } from "./ServerMessage";
import { UserMessage } from "./UserMessage";
import { OtherMessage } from "./OtherMessage";
import { Invitation } from "./Invitation";
import styles from "./Messages.module.scss";

import { ChannelContext } from "@/contexts";
import { useUser, useSocket, useTheme } from "@hooks";
import { type IMessage } from "@/interfaces";
import { customFetch, ResponseError } from "@/helpers";

export const Messages: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [showOptions, setShowOptions] = useState<number>(-1);

  const user = useUser();
  const socket = useSocket();
  const theme = useTheme();

  const { activeChannel } = useContext(ChannelContext);
  if (activeChannel === undefined) {
    throw new Error("Undefined Active Channel");
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!activeChannel) {
        return setMessages([]);
      }
      const response = await customFetch("GET", `chat/${activeChannel.id}`);
      if (!response.ok) {
        throw new ResponseError("Failed on fetch channels request", response);
      }
      const data = await response.json();
      setMessages(data);
    };

    fetchData();

    const handleMessage = (message: IMessage) => {
      if (message.channelId === activeChannel.id) {
        setMessages((prev: IMessage[]) => [message, ...prev]);
      }
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [activeChannel]);

  return (
    <div className={styles.Messages}>
      {messages.map((message, index) => {
        if (!message.senderId) {
          return <ServerMessage key={index} message={message} theme={theme} />;
        }
        if (message.content.substring(0, 13) === "/InviteToPlay" && message.senderId) {
          return <Invitation key={index} message={message} theme={theme} />
        }
        if (message.senderId === user?.id) {
          return <UserMessage key={index} message={message} theme={theme} />;
        }

        return (
          <OtherMessage
            key={index}
            message={message}
            theme={theme}
            showOptions={showOptions === index}
            setShowOptions={() => (showOptions === index ? setShowOptions(-1) : setShowOptions(index))}
          />
        );
      })}
    </div>
  );
};
