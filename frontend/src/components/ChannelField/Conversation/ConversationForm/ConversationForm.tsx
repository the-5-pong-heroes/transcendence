import React, { useEffect, useState, useCallback } from "react";

import styles from "./ConversationForm.module.scss";

import type { IChannel, IChannelUser } from "@/interfaces";
import { useUser, useSocketContext } from "@hooks";
import { type SocketParameters } from "@types";
import { Rocket } from "@/assets";

interface IConversationFormProps {
  activeChannel: IChannel | null;
}

export const ConversationForm: React.FC<IConversationFormProps> = ({ activeChannel }) => {
  const [message, setMessage] = useState<string>("");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const { user } = useUser();
  const { socket }: SocketParameters = useSocketContext();

  const submit = (): void => {
    const token = localStorage.getItem("access_token");
    if (!token || message === "" || !activeChannel || !user) {
      return; // TODO faire une redirection
    }
    const sentMessage = {
      content: message,
      channelId: activeChannel.id,
      senderId: user.id,
    };
    socket?.emit("message", sentMessage);
    setMessage("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(event.target.value);
    event.target.style.height = "30px";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      const { key, shiftKey } = event;
      const { id } = event.target as HTMLTextAreaElement;
      if (key !== "Enter" || shiftKey || id !== "message") {
        return;
      }
      event.preventDefault();
      submit();
      const target = event.target as HTMLTextAreaElement;
      target.style.height = "30px";
    };
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [message]);

  useEffect(() => {
    const activeUser = activeChannel?.users.find((usr: IChannelUser) => usr.user.id === user?.id);
    if (activeUser) {
      setIsMuted(activeUser.isMuted);
    }
  }, [activeChannel, user?.id]);

  return (
    <form className={styles.Form} autoComplete="off" onSubmit={handleSubmit}>
      <textarea
        id="message"
        value={message}
        className={styles.ContentEditable}
        onChange={handleChange}
        disabled={!activeChannel || isMuted}
        title={isMuted ? "You are mute" : undefined}
        style={{ cursor: `${isMuted ? "not-allowed" : ""}` }}
      />
      <button
        className={styles.Submit}
        title="Send"
        type="submit"
        style={{ backgroundImage: `url(${Rocket})` }}
        disabled={!activeChannel}
      />
    </form>
  );
};
