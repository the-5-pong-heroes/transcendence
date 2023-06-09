import React, { useContext, useEffect, useState } from "react";

import { ChannelType } from "./ChannelType";
import { ChannelUser } from "./ChannelUser";
import { ChannelBan } from "./ChannelBan";
import styles from "./ChannelOptions.module.scss";

import { ChannelContext } from "@/contexts";

interface IReturnMessage {
  error: boolean;
  message: string;
}

export const ChannelOptions: React.FC = () => {
  const [returnMessage, setReturnMessage] = useState<IReturnMessage>({ error: true, message: "" });

  const { activeChannel } = useContext(ChannelContext);
  if (activeChannel === undefined) {
    throw new Error("Undefined Active Channel");
  }

  const stopOutterScroll = (event: any) => {
    const container = event.target.closest(".container");
    container.style.overflow = "hidden";
  };

  const enableOutterScroll = (event: any) => {
    const container = event.target.closest(".container");
    container.style.overflow = "";
  };

  useEffect(() => {
    setReturnMessage((prev) => ({ ...prev, message: "" }));
  }, [activeChannel]);

  return (
    <div onMouseEnter={stopOutterScroll} onMouseLeave={enableOutterScroll} className={styles.ChannelOptions}>
      <ChannelType setReturnMessage={setReturnMessage} />
      <ChannelUser users={activeChannel.users} />
      <ChannelBan banned={activeChannel.banned} />
    </div>
  );
};
