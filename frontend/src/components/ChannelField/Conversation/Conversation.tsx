import React from "react";

import { Messages } from "./Messages";
import { ConversationForm } from "./ConversationForm";
import styles from "./Conversation.module.scss";

export const Conversation: React.FC = () => {
  const stopOutterScroll = (event: any) => {
    const container = event.target.closest(".container");
    container.style.overflow = "hidden";
  };

  const enableOutterScroll = (event: any) => {
    const container = event.target.closest(".container");
    container.style.overflow = "";
  };

  return (
    <div onMouseEnter={stopOutterScroll} onMouseLeave={enableOutterScroll} className={styles.Conversation}>
      <Messages />
      <ConversationForm />
    </div>
  );
};
