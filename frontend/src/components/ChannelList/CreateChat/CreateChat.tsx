import React, { useEffect, useState } from "react";

import styles from "./CreateChat.module.scss";

import { useUser, useSocket, useTheme } from "@hooks";
import { UserContext } from "@/contexts";

interface IChannel {
  name: string;
  type: string;
  password?: string;
  users?: {
    userId: string;
  };
}

const types: string[] = ["Public", "Private", "Protected"];

export const CreateChat: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [channel, setChannel] = useState<IChannel>({ name: "", type: "PUBLIC" });
  const user = useUser();
  const socket = useSocket();
  const theme = useTheme();

  useEffect(() => {
    if (!user) {
      return;
    }
    setChannel((prev: IChannel) => ({ ...prev, users: { userId: user.id } }));
  }, [user]);

  const handleClick = () => {
    setShowForm((prev: boolean) => !prev);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setChannel((prev: IChannel) => ({ ...prev, [name]: value }));
    if (name === "type" && value === "PROTECTED") {
      setChannel((prev: IChannel) => ({ ...prev, password: "" }));
    }
    if (name === "type" && value !== "PROTECTED") {
      setChannel((prev: IChannel) => ({ ...prev, password: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    socket.emit("create", channel);
    setChannel((prev: IChannel) => ({ users: prev.users, name: "", type: "PUBLIC" }));
    setShowForm(false);
  };

  return (
    <div className={styles.CreateChat}>
      <button
        className={`${styles.Button} ${theme === "light" ? styles.ButtonLight : styles.ButtonDark}`}
        onClick={handleClick}>
        +
      </button>
      {showForm && (
        <form
          className={`${styles.Form} ${theme === "light" ? styles.FormLight : styles.FormDark}`}
          onSubmit={handleSubmit}>
          <input
            className={styles.InputName}
            type="text"
            name="name"
            placeholder="Channel's Name"
            value={channel.name}
            onChange={handleChange}
            required={true}
          />
          <div className={styles.Type}>
            {types.map((type: string, index: number) => {
              return (
                <label key={index} className={styles.TypeLabel}>
                  <input
                    className={styles.InputType}
                    type="radio"
                    name="type"
                    value={type.toUpperCase()}
                    checked={channel.type == type.toUpperCase()}
                    onChange={handleChange}
                  />
                  <span>{type}</span>
                </label>
              );
            })}
          </div>
          {channel.type === "PROTECTED" && (
            <input
              className={styles.Password}
              type="text"
              name="password"
              placeholder="Password"
              value={channel.password}
              onChange={handleChange}
              required={channel.type === "PROTECTED"}
            />
          )}
          <input className={styles.Submit} type="submit" />
        </form>
      )}
    </div>
  );
};
