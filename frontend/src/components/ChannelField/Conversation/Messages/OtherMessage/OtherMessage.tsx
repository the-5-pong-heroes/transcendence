import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext, UserContextType } from "@/contexts";
import { IMessage } from "@/interfaces";
import { socket } from "@/socket";
import styles from "./OtherMessage.module.scss";

interface IOtherMessageProps {
  message: IMessage;
  theme: string;
  showOptions: boolean;
  setShowOptions: () => void;
}

export const OtherMessage: React.FC<IOtherMessageProps> = ({ message, theme, showOptions, setShowOptions }) => {
  const [userIsBlocked, setUserIsBlocked] = useState<boolean>(false);
  const { user } = useContext(UserContext) as UserContextType;
  const optionsRef = useRef<any>(null);

  useEffect(() => {
    if (!optionsRef || !optionsRef.current) return;
    const { top, bottom } = optionsRef.current.getBoundingClientRect();
    if (window.innerHeight < bottom + 60)
      optionsRef.current.style.bottom = `${top - (window.innerHeight - 60)}px`;
  }, [showOptions])

  const handleViewProfile = () => {
    alert("View profile clicked");
  }

  const handleAddFriend = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    const config = {
      method: "POST",
      mode: "cors" as RequestMode,
      headers: {
        "Authorization": token,
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify({ newFriendId: message.senderId }),
    }
    const response = await fetch("http://localhost:3000/friendship", config);
    if (!response.ok) return console.log("Error friendship");
    setShowOptions()
  }

  const handleBlock = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    socket.emit('block', { blockedUserId: message.senderId, toBlock: !userIsBlocked, userId: user.id });
    setShowOptions()
  }

  useEffect(() => {
    setUserIsBlocked(user.blocked.some(block => block.blockedUserId === message.senderId));
  }, [user])

  return (
    <div className={`${styles.OtherMessage} ${theme === "light" ? styles.OtherMessageLight : styles.OtherMessageDark}`}>
      <div className={styles.Avatar} onClick={() => setShowOptions()}/>
      {showOptions &&
        <div className={styles.Options} ref={optionsRef}>
          <div className={styles.Option} onClick={handleViewProfile}>View profile</div>
          <div className={styles.Option} onClick={handleAddFriend}>Add to friend</div>
          <div className={styles.Option} onClick={handleBlock}>{userIsBlocked ? "Unblock" : "Block"}</div>
        </div>
      }
      <div className={styles.Message}>
        <span>{message.sender?.name}</span>
        {userIsBlocked ? <i>This user is blocked</i> : message.content}
      </div>
    </div>
  );
}
