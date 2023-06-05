<<<<<<< HEAD
import React, { useEffect, useState } from "react";

import styles from "./ChannelBan.module.scss";

import type { IChannel, IChannelBan, IChannelUser } from "@/interfaces";
import { useUser, useSocketContext } from "@hooks";
import { type SocketParameters } from "@types";

interface IChannelBanProps {
  activeChannel: IChannel;
  banned: [IChannelBan];
}

export const ChannelBan: React.FC<IChannelBanProps> = ({ activeChannel, banned }) => {
  const [activeUser, setActiveUser] = useState<IChannelBan>();
  const [userRole, setUserRole] = useState<string>();

  const { user } = useUser();
  const { socket }: SocketParameters = useSocketContext();

  useEffect(() => {
    setUserRole(activeChannel.users.find((usr: IChannelUser) => usr.user.id === user?.id)?.role);
  }, [user, activeChannel.users]);

  const handleUnban = (): void => {
    // const token = localStorage.getItem("access_token");
    // if (!token || !activeUser) {
    //   return;
    // }
    if (!activeUser) {
      return;
    }
    socket?.emit("unbanChannelUser", { id: activeUser.id, channelId: activeChannel.id });
  };

  const bannedUsersTitle = `Channel's banned users :`;

  return banned.length ? (
    <div className={styles.ChannelBan}>
      <div className={styles.Title}>{bannedUsersTitle}</div>
      <div className={styles.ChannelBanTable}>
        {banned.map((usr) => {
          return (
            <div
              key={usr.user.id}
              className={`${styles.ChannelUserItem} ${activeUser === usr ? styles.ActiveUser : ""}`}
              onClick={() => setActiveUser(usr)}>
              <div>{usr.user.id}</div>
              <div>{new Date(usr.bannedUntil).toLocaleDateString("fr-FR", { minute: "numeric", hour: "numeric" })}</div>
            </div>
          );
        })}
      </div>
      {userRole !== "USER" && (
        <div className={styles.ChannelBanOptions}>
          <button className={styles.Button} onClick={() => handleUnban()} disabled={!activeUser}>
            Unban
          </button>
        </div>
      )}
    </div>
  ) : (
    <></>
  );
};
=======
import React, { useContext, useEffect, useState } from "react";
import { AppContext, ChannelContext, UserContext, UserContextType } from "../../../../contexts";
import { IChannelBan, IChannelUser } from "../../../../interfaces";
import { socket } from "../../../../socket";
import styles from "./ChannelBan.module.scss";

interface IChannelBanProps {
  banned: [IChannelBan];
}

export const ChannelBan: React.FC<IChannelBanProps> = ({ banned }) => {
  const [activeUser, setActiveUser] = useState<IChannelBan>();
  const [userRole, setUserRole] = useState<string>();

  const { user } = useContext(UserContext) as UserContextType;
  const { activeChannel } = useContext(ChannelContext);
  if (activeChannel === undefined) throw new Error("Undefined AppContext");

  const appContext = useContext(AppContext);
  if (appContext === undefined) throw new Error("Undefined AppContext");
  const { theme } = appContext;

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
    <div className={`${styles.ChannelBan} ${theme === "light" ? styles.ChannelBanLight : styles.ChannelBanDark}`}>
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
>>>>>>> master
