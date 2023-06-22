import React from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import { ChannelList, ChannelField } from "../../components";

import styles from "./Chat.module.scss";

import { ChannelProvider, UserProvider } from "@/contexts";

interface IChatProps {
  chatRef: React.RefObject<HTMLDivElement>;
}

const fallbackRender: React.FC<FallbackProps> = ({ error }) => {
  return (
    <div role="alert" className={styles.ChatError}>
      <p>ERROR :</p>
      <pre style={{ color: "red" }}>{(error as Error).message}</pre>
    </div>
  );
};

export const Chat: React.FC<IChatProps> = ({ chatRef }) => {
  return (
    <ErrorBoundary fallbackRender={fallbackRender} onReset={(details) => {}}>
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
    </ErrorBoundary>
  );
};
