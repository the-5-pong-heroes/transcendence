import React, { useContext, useEffect, useState } from "react";
import { UserContext, UserContextType } from "../../../../contexts";
import { IChannel, IChannelBan, IChannelUser } from "../../../../interfaces";
import { socket } from "../../../../socket";
import styles from "./ChannelBan.module.scss";

interface IChannelBanProps {
  activeChannel: IChannel;
  banned: [IChannelBan];
}

export const ChannelBan: React.FC<IChannelBanProps> = ({ activeChannel, banned }) => {
  const [activeUser, setActiveUser] = useState<IChannelBan>();
  const [userRole, setUserRole] = useState<string>();

  const { user } = useContext(UserContext) as UserContextType;

  useEffect(() => {
    setUserRole(activeChannel.users.find((usr: IChannelUser) => usr.user.id === user.id)?.role);
  }, [user]);

  const handleUnban = () => {
    const token = localStorage.getItem('access_token');
    if (!token || !activeUser) return;
    socket.emit("unbanChannelUser", { id: activeUser.id, channelId: activeChannel.id })
  }

  return (
    banned.length ? 
    <div className={styles.ChannelBan}>
      <div className={styles.Title}>
        Channel's banned users :
      </div>
      <div className={styles.ChannelBanTable}>
        {banned.map(usr => {
          return (
          <div
            key={usr.user.id}
            className={`${styles.ChannelUserItem} ${activeUser === usr && styles.ActiveUser}`}
            onClick={() => setActiveUser(usr)}
          >
            <div>{usr.user.id}</div>
            <div>{new Date(usr.bannedUntil).toLocaleDateString("fr-FR", {minute: "numeric", hour: "numeric"})}</div>
          </div>);
        })}
      </div>
      {
      userRole !== "USER" &&
      <div className={styles.ChannelBanOptions}>
        <button
          className={styles.Button}
          onClick={() => handleUnban()}
          disabled={!activeUser}
        >
          Unban
        </button>
      </div>
      }
    </div>
    :
    <></>
  );
}
