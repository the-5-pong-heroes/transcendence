import React, { useCallback, useEffect, useState } from "react";

import styles from "./ChannelType.module.scss";

import { type IChannel } from "@/interfaces";
import { Public, Protected, Private, View, Hide } from "@/assets";
import { useUser, useSocketContext } from "@hooks";
import { type SocketParameters } from "@types";

interface IChannelTypeProps {
  activeChannel: IChannel;
  setReturnMessage: (prev: any) => void;
}

interface IChannelUpdate {
  id: string;
  password?: string;
  type: string;
}

const typeIcons: Record<string, string> = {
  PUBLIC: Public,
  PROTECTED: Protected,
  PRIVATE: Private,
};

const types: string[] = ["PUBLIC", "PROTECTED", "PRIVATE"];

export const ChannelType: React.FC<IChannelTypeProps> = ({ activeChannel, setReturnMessage }) => {
  const filterActiveChannel = useCallback(() => {
    const { id, password, type } = activeChannel;

    return { id, password, type } as IChannelUpdate;
  }, [activeChannel]);

  const [newChannel, setNewChannel] = useState<IChannelUpdate>(filterActiveChannel);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const { user } = useUser();
  const { socket }: SocketParameters = useSocketContext();

  const changeType = (type: string): void => {
    setNewChannel((prev: IChannelUpdate) => ({ ...prev, type }));
  };

  const changePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setNewChannel((prev: IChannelUpdate) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const token = window.localStorage.getItem("access_token");
    if (!token || !newChannel) {
      return;
    }
    if (newChannel.type === activeChannel.type && newChannel.password == activeChannel.password) {
      return;
    }
    if (newChannel.type === "PROTECTED" && !newChannel.password) {
      return setReturnMessage({ error: true, message: "Password cannot be empty" });
    }
    socket?.emit(
      "updateChannelType",
      { ...newChannel, password: newChannel.type === "PROTECTED" ? newChannel.password : "" },
      (res: any) => {
        console.log(res);
      }
    );
    setReturnMessage({ error: false, message: "Changes to channel saved" });
  };

  useEffect(() => {
    setNewChannel(filterActiveChannel);
    setShowPassword(false);
    setIsOwner(
      activeChannel.users.some((usr) => {
        return usr.user.id === user?.id && usr.role === "OWNER";
      })
    );
  }, [activeChannel, user?.id, filterActiveChannel]);

  return isOwner ? (
    <form className={styles.ChannelType} onSubmit={handleSubmit}>
      <div className={styles.ChannelTypeOptions}>
        {types.map((type) => {
          return (
            <div
              key={type}
              className={`${styles.Type} ${newChannel.type === type ? styles.ActiveType : ""}`}
              onClick={() => changeType(type)}>
              <div className={styles.TypeIcon} style={{ backgroundImage: `url(${typeIcons[type]})` }} />
              {type.substring(0, 1) + type.substring(1).toLowerCase()}
            </div>
          );
        })}
      </div>
      {newChannel.type === "PROTECTED" && (
        <div className={styles.Password}>
          <input
            className={styles.PasswordInput}
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={newChannel.password}
            onChange={changePassword}
            required={newChannel.type === "PROTECTED"}
          />
          <div
            className={styles.PasswordIcon}
            style={{ backgroundImage: `url(${showPassword ? Hide : View})` }}
            onClick={() => setShowPassword((prev) => !prev)}
          />
        </div>
      )}
      <input className={styles.Button} type="submit" value="Save type change" />
    </form>
  ) : (
    <div className={styles.ChannelType}>
      <div className={styles.ChannelTypeOptions}>
        <div className={styles.TypeNotOwner}>
          <div className={styles.TypeIcon} style={{ backgroundImage: `url(${typeIcons[activeChannel.type]})` }} />
          {activeChannel.type.substring(0, 1) + activeChannel.type.substring(1).toLowerCase()}
        </div>
      </div>
    </div>
  );
};
