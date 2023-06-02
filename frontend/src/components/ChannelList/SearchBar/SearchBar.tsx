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
    console.log(data);
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
      <input
        className={styles.Input}
        type="text"
        value={input}
        placeholder="Search for channels"
        onChange={handleChange}
      />
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
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}
