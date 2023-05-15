import React, { useContext, useEffect, useState } from 'react';
import { UserContext, UserContextType } from '../../../../contexts';
import { IChannel, IChannelUser } from '../../../../interfaces';
import { socket } from '../../../../socket';
import { Rocket } from '../../../../assets';
import styles from './ConversationForm.module.scss';

interface IConversationFormProps {
  activeChannel: IChannel | null;
}

export const ConversationForm: React.FC<IConversationFormProps> = ({ activeChannel }) => {
  const [message, setMessage] = useState<string>("");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const { user } = useContext(UserContext) as UserContextType;

  const submit = () => {
    const token = localStorage.getItem('access_token');
    if (!token || message === "" || !activeChannel || !user) return; // TODO faire une redirection
    const sentMessage = {
      content: message,
      channelId: activeChannel.id,
      senderId: user.id
    };
    socket.emit('message', sentMessage);
    setMessage("");
  }

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
    if (charCode !== 13 || shiftKey || id !== "message") return;
    event.preventDefault();
    submit();
    event.target.style.height = "30px";
  }

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    }
  }, [message]);

  useEffect(() => {
    const activeUser = activeChannel?.users.find((usr: IChannelUser) => usr.user.id === user.id);
    if (activeUser)
      setIsMuted(activeUser.isMuted);
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
        style={{cursor: `${isMuted && "not-allowed"}`}}
      />
      <button
        className={styles.Submit}
        title="Send"
        type="submit"
        style={{backgroundImage: `url(${Rocket})`}}
        disabled={!activeChannel}
      />
    </form>
  );
}
