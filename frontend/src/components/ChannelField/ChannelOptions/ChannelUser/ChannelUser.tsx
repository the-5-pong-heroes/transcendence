import React, { useContext, useEffect, useState } from "react";
import { UserContext, UserContextType } from "../../../../contexts";
import { IChannelUser } from "../../../../interfaces";
// import { socket } from "../../../../socket";
import { useUser, useSocketContext, useAppContext } from "@hooks";
import type { SocketParameters, AppContextParameters } from "@types";
import { ClientEvents } from "@Game/@types";

import styles from "./ChannelUser.module.scss"

interface IChannelUserProps {
  users: [IChannelUser];
}

const roles = [
  "ADMIN",
  "USER",
]

export const ChannelUser: React.FC<IChannelUserProps> = ({ users }) => {
  const [activeUser, setActiveUser] = useState<IChannelUser | null>(null);
  const [untilOption, setUntilOption] = useState<string>("");
  const [untilNumber, setUntilNumber] = useState<number>(0)
  const [userRole, setUserRole] = useState<string>();

  {/* const { user } = useContext(UserContext) as UserContextType; */}
  const { user } = useUser();
  const { socket }: SocketParameters = useSocketContext();
  const { theme }: AppContextParameters = useAppContext();

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    // const token = localStorage.getItem('access_token');
    // if (!token || !activeUser) return;
    if (!activeUser) return;
    socket?.emit("updateChannelUser", { id: activeUser.id, role: value })
  }

  const toggleMuteUser = (event: any) => {
    event.preventDefault();
    // const token = localStorage.getItem('access_token');
    // if (!token || !activeUser) return;
    if (!activeUser) return;
    socket?.emit("updateChannelUser", { id: activeUser.id, isMuted: !activeUser.isMuted, mutedUntil: new Date(Date.now() + untilNumber * 60000) })
    setUntilOption("");
    setUntilNumber(0);
  }

  const kickUser = () => {
    // const token = localStorage.getItem('access_token');
    // if (!token || !activeUser) return;
    if (!activeUser) return;
    socket?.emit("kickChannelUser", { id: activeUser.id })
  }

  const banUser = (event: any) => {
    event?.preventDefault();
    // const token = localStorage.getItem('access_token');
    // if (!token || !activeUser) return;
    if (!activeUser) return;
    socket?.emit("banChannelUser", { id: activeUser.id, bannedUntil: new Date(Date.now() + untilNumber * 60000) })
    setUntilOption("");
    setUntilNumber(0);
  }

  useEffect(() => {
    if (!activeUser) return;
    const newActiveUser = users.find((usr: IChannelUser) => usr.id === activeUser.id);
    if (newActiveUser)
      setActiveUser(newActiveUser);
  }, [users]);

  useEffect(() => {
    setUserRole(users.find((usr: IChannelUser) => usr.user.id === user?.id)?.role);
  }, [user]);

  return (
    <div className={`${styles.ChannelUser} ${theme === "light" ? styles.ChannelUserLight : styles.ChannelUserDark}`}>
      {!untilOption ?
        <div className={styles.ChannelUserBoard}>
          <div className={styles.Title}>
            Channel's users :
          </div>
          <div className={styles.ChannelUserTable}>
            {users.map((usr: IChannelUser) => {
              return (
              <div
                key={usr.user.id}
                className={`${styles.ChannelUserItem} ${activeUser === usr && styles.ActiveUser}`}
                onClick={() => setActiveUser(usr)}
              >
                <div>{usr.user.name}</div>
                {/* {user?.id !== usr.user.id && <button onClick={() => inviteToPlay(usr.user.id)}>Invite to play</button>} */}
                <select name="role" value={usr.role} onChange={handleRoleChange} disabled={userRole === "USER" || activeUser !== usr}>
                  {
                  usr.role === "OWNER" ?
                  <option
                    value="OWNER"
                    disabled={true}
                  >
                    Owner
                  </option>
                  :
                  roles.map((role: string) => {
                    return (
                      <option
                        key={role}
                        value={role}
                      >
                        {role[0] + role.substring(1).toLowerCase()}
                      </option>
                    );
                  })
                  }
                </select>
              </div>);
            })}
          </div>
          {
          userRole !== "USER" &&
          <div className={styles.ChannelUserOptions}>
            <button
              className={styles.Button}
              onClick={activeUser?.isMuted ? toggleMuteUser : () => setUntilOption("Mute")}
              disabled={!activeUser || activeUser.role === "OWNER"}
            >
              {activeUser?.isMuted ? "Unmute" : "Mute"}
            </button>
            <button
              className={styles.Button}
              onClick={kickUser}
              disabled={!activeUser || activeUser.role === "OWNER"}
            >
              Kick
            </button>
            <button
              className={styles.Button}
              onClick={() => setUntilOption("Ban")}
              disabled={!activeUser || activeUser.role === "OWNER"}
            >
              Ban
            </button>
          </div>
          }
        </div>
        :
        <form className={styles.Until} onSubmit={untilOption === "Mute" ? toggleMuteUser : banUser}>
          {untilOption} {activeUser?.user.name} for
          <input
            className={styles.UntilInput}
            type="number"
            value={untilNumber}
            onChange={(event) => setUntilNumber(+event.target.value)}
          />
          minutes.
          <div className={styles.UntilButtons}>
            <input
              className={styles.Button}
              type="submit"
              value={untilOption}
            />
            <button
              className={styles.Button}
              onClick={() => setUntilOption("")}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      }
    </div>
  );
}
