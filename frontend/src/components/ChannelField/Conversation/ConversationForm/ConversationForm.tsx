import React, { useContext, useEffect, useState } from "react";

import { ChannelContext } from "../../../../contexts";
import { type IChannelUser } from "../../../../interfaces";
import { Rocket, Game } from "../../../../assets";

import styles from "./ConversationForm.module.scss";

import { useUser, useSocket, useTheme } from "@hooks";

export const ConversationForm: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const user = useUser();
  const socket = useSocket();
  const { activeChannel } = useContext(ChannelContext);
  if (activeChannel === undefined) {
    throw new Error("Undefined Active Channel");
  }
  const theme = useTheme();

  const submit = () => {
    if (message === "" || !activeChannel || !user) {
      return;
    }
    const sentMessage = {
      content: message,
      channelId: activeChannel.id,
      senderId: user.id,
    };
    socket.emit("message", sentMessage);
    setMessage("");
  };

  const handleChange = (event: any) => {
    setMessage(event.target.value);
    event.target.style.height = "30px";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const handleKeyPress = (event: any) => {
    const { charCode, shiftKey } = event;
    const { id } = event.target;
    if (charCode !== 13 || shiftKey || id !== "message") {
      return;
    }
    event.preventDefault();
    submit();
    event.target.style.height = "30px";
  };

  const sendInviteToPlay = () => {
    setMessage("/InviteToPlay");
    submit();
  };

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [message]);

  useEffect(() => {
    const activeUser = activeChannel.users.find((usr: IChannelUser) => usr.user.id === user?.id);
    if (activeUser) {
      setIsMuted(activeUser.isMuted);
    }
  }, [activeChannel]);

  return (
    <form className={styles.Form} autoComplete="off" onSubmit={handleSubmit}>
      <textarea
        id="message"
        value={message}
        className={styles.ContentEditable}
        onChange={handleChange}
        disabled={!activeChannel || isMuted}
        title={isMuted ? "You are mute" : undefined}
        style={{ cursor: `${isMuted && "not-allowed"}` }}
      />
      <div className={styles.Buttons}>
        <button
          className={`${styles.Submit} ${theme === "light" ? styles.SubmitLight : styles.SubmitDark}`}
          title="Send"
          type="submit"
          style={{ backgroundImage: `url(${Rocket})` }}
          disabled={!activeChannel}
        />
        <button
          className={`${styles.Invite} ${theme === "light" ? styles.InviteLight : styles.InviteDark}`}
          title="Invite to Game"
          onClick={sendInviteToPlay}
          style={{ backgroundImage: `url(${Game})` }}
          disabled={!activeChannel}
        />
      </div>
    </form>
  );
};
