import React, { useEffect, useState } from "react";

import { type IChannel } from "../../../interfaces";

import styles from "./ProtectedChannel.module.scss";

import { useUser, useSocket, useTheme } from "@hooks";

interface IProtectedChannelProps {
  activeChannel: IChannel | null;
}

export const ProtectedChannel: React.FC<IProtectedChannelProps> = ({ activeChannel }) => {
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const user = useUser();
  const theme = useTheme();
  const socket = useSocket();

  const handleChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
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
    <div className={`${styles.ProtectedChannel} ${theme === "light" ? styles.ProtectedChannelLight : ""}`}>
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
