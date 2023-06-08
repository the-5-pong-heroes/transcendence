import React, { useContext, useEffect, useState } from "react";

import { UserContext, UserContextType } from "../../../contexts";
import { type IChannel } from "../../../interfaces";

// import { socket } from "../../../socket";
import styles from "./ProtectedChannel.module.scss";

import { useUser, useSocket } from "@hooks";

interface IProtectedChannelProps {
  activeChannel: IChannel | null;
}

export const ProtectedChannel: React.FC<IProtectedChannelProps> = ({ activeChannel }) => {
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  // const { user } = useContext(UserContext) as UserContextType;
  const user = useUser();
  const socket = useSocket();

  const handleChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // const token = window.localStorage.getItem('access_token');
    // if (!token || !user?.id || !activeChannel || password === "") return;
    if (!user?.id || !activeChannel || password === "") {
      return;
    }
    const data = { channelId: activeChannel.id, userId: user.id, password };
    socket.emit("submitPassword", data, (response: any) => {
      setErrorMessage(response);
    });
    setPassword("");
  };

  useEffect(() => {
    setErrorMessage("");
  }, []);

  return (
    <div className={styles.ProtectedChannel}>
      <form className={styles.Form} onSubmit={handleSubmit}>
        <div>Enter password channel please:</div>
        <input className={styles.Password} type="password" value={password} onChange={handleChange} required={true} />
        <button className={styles.Button} type="submit">
          Enter
        </button>
        {errorMessage && <div className={styles.ErrorMessage}>{errorMessage}</div>}
      </form>
    </div>
  );
};
