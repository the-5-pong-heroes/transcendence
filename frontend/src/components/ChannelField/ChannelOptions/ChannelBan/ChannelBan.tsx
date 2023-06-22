import React, { useContext, useEffect, useState } from "react";

import { ChannelContext } from "../../../../contexts";
import { type IChannelBan, type IChannelUser } from "../../../../interfaces";

import styles from "./ChannelBan.module.scss";

import { useUser, useSocket, useTheme } from "@hooks";

interface IChannelBanProps {
  banned: [IChannelBan];
}

export const ChannelBan: React.FC<IChannelBanProps> = ({ banned }) => {
  const [activeUser, setActiveUser] = useState<IChannelBan>();
  const [userRole, setUserRole] = useState<string>();

  const user = useUser();
  const socket = useSocket();
  const { activeChannel } = useContext(ChannelContext);
  if (activeChannel === undefined) {
    throw new Error("Undefined AppContext");
  }

  const theme = useTheme();

  useEffect(() => {
    setUserRole(activeChannel.users.find((usr: IChannelUser) => usr.user.id === user?.id)?.role);
  }, [user]);

  const handleUnban = () => {
    if (!activeUser) {
      return;
    }
    socket.emit("unbanChannelUser", { id: activeUser.id, channelId: activeChannel.id });
  };

  return banned.length ? (
    <div className={`${styles.ChannelBan} ${theme === "light" ? styles.ChannelBanLight : styles.ChannelBanDark}`}>
      <div className={styles.Title}>Channel's banned users :</div>
      <div className={styles.ChannelBanTable}>
        {banned.map((usr) => {
          return (
            <div
              key={usr.user.id}
              className={`${styles.ChannelUserItem} ${activeUser === usr && styles.ActiveUser}`}
              onClick={() => setActiveUser(usr)}>
              <div>{usr.user.name}</div>
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
