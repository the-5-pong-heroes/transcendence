import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./OtherMessage.module.scss";

import { type IMessage } from "@/interfaces";
import { useUser, useSocket } from "@hooks";
import { customFetch, ResponseError } from "@/helpers";
import { DefaultAvatar } from "@/assets";

interface IOtherMessageProps {
  message: IMessage;
  theme: string;
  showOptions: boolean;
  setShowOptions: () => void;
}

export const OtherMessage: React.FC<IOtherMessageProps> = ({ message, theme, showOptions, setShowOptions }) => {
  const [userIsBlocked, setUserIsBlocked] = useState<boolean>(false);
  const [userIsFriend, setUserIsFriend] = useState<boolean>(false);
  const user = useUser();
  const socket = useSocket();
  const optionsRef = useRef<any>(null);
  const navigate = useNavigate();

  const handleViewProfile = () => {
    if (message.senderId) {
      navigate("/Profile/" + message.senderId);
    }
  };

  const handleFriend = async () => {
    if (!userIsFriend) {
      const response = await customFetch("POST", "friendship", { newFriendId: message.senderId });
      if (!response.ok) {
        throw new ResponseError("Failed on fetch channels request", response);
      }
    } else {
      const response = await customFetch("DELETE", "friendship", { friendId: message.senderId });
      if (!response.ok) {
        throw new ResponseError("Failed on fetch channels request", response);
      }
    }
    setUserIsFriend(!userIsFriend);
    setShowOptions();
  };

  const handleBlock = () => {
    socket.emit("block", { blockedUserId: message.senderId, toBlock: !userIsBlocked, userId: user?.id });
    setShowOptions();
  };

  useEffect(() => {
    if (!user) {
      return;
    }

	const fetchBlocked = async () => {
	  const response = await customFetch("GET", "blocked");
	  if (!response.ok) {
	    throw new ResponseError("Failed on fetch channels request", response);
	  }
	  const data = await response.json();
      setUserIsBlocked(data.some((block: any) => block.blockedUserId === message.senderId));
	}

	fetchBlocked();
    setUserIsFriend(user.addedBy?.some((friendship) => friendship.userId === message.senderId));
  }, [user]);

  useEffect(() => {
    if (!optionsRef || !optionsRef.current) {
      return;
    }
    const { top, bottom } = optionsRef.current.getBoundingClientRect();
    if (window.innerHeight > 652 && 652 + (window.innerHeight - 652) / 2 < bottom + 60) {
      optionsRef.current.style.bottom = `${top - (652 + (window.innerHeight - 652) / 2 - 60)}px`;
    } else if (window.innerHeight < 652 && window.innerHeight < bottom + 60) {
      optionsRef.current.style.bottom = `${top - (window.innerHeight - 60)}px`;
    }
  }, [showOptions]);

  return (
    <div className={`${styles.OtherMessage} ${theme === "light" ? styles.OtherMessageLight : styles.OtherMessageDark}`}>
      <div
        className={styles.Avatar}
        onClick={() => setShowOptions()}
        style={{ backgroundImage: `url(${message.sender?.avatar ? message.sender.avatar : DefaultAvatar})` }}
      />
      {showOptions && (
        <div className={styles.Options} ref={optionsRef}>
          <div className={styles.Option} onClick={handleViewProfile}>
            View profile
          </div>
          <div className={styles.Option} onClick={handleFriend}>
            {userIsFriend ? "Delete" : "Add to"} friend
          </div>
          <div className={styles.Option} onClick={handleBlock}>
            {userIsBlocked ? "Unblock" : "Block"}
          </div>
        </div>
      )}
      <div className={styles.Message}>
        <span>{message.sender?.name}</span>
        {userIsBlocked ? <i>This user is blocked</i> : message.content}
      </div>
    </div>
  );
};
