import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./OtherMessage.module.scss";

import { UserContext, UserContextType } from "@/contexts";
import { type IMessage } from "@/interfaces";
// import { socket } from "@/socket";
import { useUser, useSocket } from "@hooks";
import { ResponseError } from "@/helpers";

interface IOtherMessageProps {
  message: IMessage;
  theme: string;
  showOptions: boolean;
  setShowOptions: () => void;
}

export const OtherMessage: React.FC<IOtherMessageProps> = ({ message, theme, showOptions, setShowOptions }) => {
  const [userIsBlocked, setUserIsBlocked] = useState<boolean>(false);
  const [userIsFriend, setUserIsFriend] = useState<boolean>(false);
  // const { user } = useContext(UserContext) as UserContextType;
  const user = useUser();
  const socket = useSocket();
  const optionsRef = useRef<any>(null);
  const navigate = useNavigate();

  const handleViewProfile = () => {
    if (message.senderId) {
      navigate("/profile/" + message.senderId);
    }
  };

  const handleFriend = async () => {
    // const token = localStorage.getItem('access_token');
    // if (!token) return;
    if (!userIsFriend) {
      const config = {
        method: "POST",
        mode: "cors" as RequestMode,
        credentials: "include" as RequestCredentials,
        headers: {
          // "Authorization": token,
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ newFriendId: message.senderId }),
      };
      const response = await fetch("http://localhost:3000/friendship", config);
      if (!response.ok) {
        throw new ResponseError("Failed on fetch channels request", response);
      }
      // if (!response.ok) return console.log("Error friendship");
    } else {
      const config = {
        method: "DELETE",
        mode: "cors" as RequestMode,
        credentials: "include" as RequestCredentials,
        headers: {
          // "Authorization": token,
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ friendId: message.senderId }),
      };
      const response = await fetch("http://localhost:3000/friendship", config);
      if (!response.ok) {
        throw new ResponseError("Failed on fetch channels request", response);
      }
      // if (!response.ok) return console.log("Error friendship");
    }
    setUserIsFriend(!userIsFriend);
    setShowOptions();
  };

  const handleBlock = async () => {
    // const token = localStorage.getItem('access_token');
    // if (!token) return;
    socket.emit("block", { blockedUserId: message.senderId, toBlock: !userIsBlocked, userId: user?.id });
    setShowOptions();
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    setUserIsBlocked(user.blocked?.some((block) => block.blockedUserId === message.senderId));
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
      <div className={styles.Avatar} onClick={() => setShowOptions()} />
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
