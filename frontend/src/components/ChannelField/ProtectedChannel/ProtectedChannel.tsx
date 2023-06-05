<<<<<<< HEAD
import React, { useEffect, useState } from "react";

import styles from "./ProtectedChannel.module.scss";

import { type IChannel } from "@/interfaces";
import { useUser, useSocketContext } from "@hooks";
import { type SocketParameters } from "@types";

=======
import React, { useContext, useEffect, useState } from "react";
import { UserContext, UserContextType } from "../../../contexts";
import { IChannel } from "../../../interfaces";
import { socket } from "../../../socket";
import styles from "./ProtectedChannel.module.scss";

>>>>>>> master
interface IProtectedChannelProps {
  activeChannel: IChannel | null;
}

export const ProtectedChannel: React.FC<IProtectedChannelProps> = ({ activeChannel }) => {
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
<<<<<<< HEAD
  const { user } = useUser();
  const { socket }: SocketParameters = useSocketContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!user?.id || !activeChannel || password === "") {
      return;
    }
    const data = { channelId: activeChannel.id, userId: user?.id, password };
    socket?.emit("submitPassword", data, (response: string) => {
      setErrorMessage(response);
    });
    setPassword("");
  };
=======
  const { user } = useContext(UserContext) as UserContextType;

  const handleChange = (event: any) => {
    setPassword(event.target.value);
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const token = window.localStorage.getItem('access_token');
    if (!token || !user.id || !activeChannel || password === "") return;
    const data = { channelId: activeChannel.id, userId: user.id, password };
    socket.emit("submitPassword", data, (response: any) => {
      setErrorMessage(response);
    });
    setPassword("");
  }
>>>>>>> master

  useEffect(() => {
    setErrorMessage("");
  }, []);

  return (
    <div className={styles.ProtectedChannel}>
      <form className={styles.Form} onSubmit={handleSubmit}>
        <div>Enter password channel please:</div>
<<<<<<< HEAD
        <input className={styles.Password} type="password" value={password} onChange={handleChange} required={true} />
        <button className={styles.Button} type="submit">
          Enter
        </button>
        {errorMessage && <div className={styles.ErrorMessage}>{errorMessage}</div>}
      </form>
    </div>
  );
};
=======
        <input
          className={styles.Password}
          type="password"
          value={password}
          onChange={handleChange}
          required={true}
        />
        <button
          className={styles.Button}
          type="submit"
        >
          Enter
        </button>
        {
          errorMessage &&
          <div className={styles.ErrorMessage}>
            {errorMessage}
          </div>
        }
      </form>
    </div>
  );
}
>>>>>>> master
