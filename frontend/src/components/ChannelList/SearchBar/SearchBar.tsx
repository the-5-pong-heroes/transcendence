<<<<<<< HEAD
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setInput(value);

    if (!value) {
      return setPreview([]);
    }
    fetch(`${BASE_URL}/chat/search/${value}`, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new ResponseError("Failed on fetch channels request", response);
        }

        return response.json();
      })
      .then((data) => {
        setPreview(data as IChannel[]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePreviewClick = (channelId: string): void => {
    socket?.emit("wantJoin", { userId: user?.id, channelId });
    setPreview([]);
    setInput("");
  };

  return (
    <div className={styles.SearchBar}>
=======
import React, { useContext, useState } from 'react';
import { AppContext, UserContext, UserContextType } from '@/contexts';
import { socket } from '@/socket';
import styles from './SearchBar.module.scss';

interface ISearch {
  id: string;
  name: string;
  type?: string;
}

export const SearchBar: React.FC = () => {
  const [preview, setPreview] = useState<ISearch[]>([])
  const [input, setInput] = useState<string>("")
  const { user } = useContext(UserContext) as UserContextType;
  const appContext = useContext(AppContext);
  if (appContext === undefined) throw new Error("Undefined AppContext");
  const { theme } = appContext;

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInput(value);
    const token = localStorage.getItem('access_token');

    if (!value || !token) return setPreview([]);
    const config = {headers: { 'Authorization': token }}
    const response = await fetch(`http://localhost:3000/chat/search/${value}`, config);
    if (!response.ok) return console.log(response);
    const data = await response.json();
    setPreview(data);
  }

  const handlePreviewClick = (channel: ISearch) => {
    socket.emit('wantJoin', { userId: user.id, channelId: channel.id, type: channel.type })
    setPreview([]);
    setInput("");
  }

  return (
    <div
      className={`${styles.SearchBar}
        ${theme === "light" ? styles.SearchBarLight : styles.SearchBarDark}`}
    >
>>>>>>> master
      <input
        className={styles.Input}
        type="text"
        value={input}
        placeholder="Search for channels"
        onChange={handleChange}
      />
<<<<<<< HEAD
      {preview.length !== 0 && (
        <div className={styles.Preview}>
          {preview.map((channel) => {
            return (
              <div key={channel.id} className={styles.PreviewItem} onClick={() => handlePreviewClick(channel.id)}>
                {channel.name}
=======
      {
        preview.length !== 0 &&
        <div className={styles.Preview}>
          {preview.map(channel => {
            return (
              <div
                key={channel.id}
                className={styles.PreviewItem}
                onClick={() => handlePreviewClick(channel)}
              >
              {channel.name}
>>>>>>> master
              </div>
            );
          })}
        </div>
<<<<<<< HEAD
      )}
    </div>
  );
};

// export const SearchBar: React.FC = () => {
//   const [preview, setPreview] = useState<IChannel[]>([]);
//   const [input, setInput] = useState<string>("");
//   // const { user } = useContext(UserContext) as UserContextType;
//   const { user } = useUser();
//   const { socket }: SocketParameters = useSocketContext();

//   const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = event.target;
//     setInput(value);
//     const token = localStorage.getItem("access_token");

//     if (!value || !token) return setPreview([]);
//     const config = { headers: { Authorization: token } };
//     const response = await fetch(`http://localhost:3000/chat/search/${value}`, config);
//     if (!response.ok) return console.log(response);
//     const data = await response.json();
//     setPreview(data);
//   };

//   const handlePreviewClick = (channelId: string): void => {
//     socket?.emit("wantJoin", { userId: user?.id, channelId });
//     setPreview([]);
//     setInput("");
//   };

//   return (
//     <div className={styles.SearchBar}>
//       <input
//         className={styles.Input}
//         type="text"
//         value={input}
//         placeholder="Search for channels"
//         onChange={handleChange}
//       />
//       {preview.length !== 0 && (
//         <div className={styles.Preview}>
//           {preview.map((channel) => {
//             return (
//               <div key={channel.id} className={styles.PreviewItem} onClick={() => handlePreviewClick(channel.id)}>
//                 {channel.name}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };
=======
      }
    </div>
  );
}
>>>>>>> master
