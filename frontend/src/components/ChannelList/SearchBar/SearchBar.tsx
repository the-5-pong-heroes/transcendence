import React, { useState } from "react";

import styles from "./SearchBar.module.scss";

import { type IChannel } from "@/interfaces";
import { useUser, useSocketContext } from "@hooks";
import { type SocketParameters } from "@types";
import { ResponseError } from "@/helpers";
import { BASE_URL } from "@/constants";

export const SearchBar: React.FC = () => {
  const [preview, setPreview] = useState<IChannel[]>([]);
  const [input, setInput] = useState<string>("");
  const { user } = useUser();
  const { socket }: SocketParameters = useSocketContext();

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const { value } = event.target;
    setInput(value);
    const token = localStorage.getItem("access_token");

    if (!value || !token) {
      return setPreview([]);
    }
    const config = { headers: { Authorization: token } };
    const response = await fetch(`${BASE_URL}/chat/search/${value}`, config);
    if (!response.ok) {
      throw new ResponseError("Failed on fetch channels request", response);
    }
    const data = (await response.json()) as IChannel[];
    setPreview(data);
  };

  const handlePreviewClick = (channelId: string): void => {
    socket?.emit("wantJoin", { userId: user?.id, channelId });
    setPreview([]);
    setInput("");
  };

  return (
    <div className={styles.SearchBar}>
      <input
        className={styles.Input}
        type="text"
        value={input}
        placeholder="Search for channels"
        onChange={() => handleChange}
      />
      {preview.length !== 0 && (
        <div className={styles.Preview}>
          {preview.map((channel) => {
            return (
              <div key={channel.id} className={styles.PreviewItem} onClick={() => handlePreviewClick(channel.id)}>
                {channel.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
