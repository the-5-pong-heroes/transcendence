import React, { useContext, useState } from 'react';
import { UserContext, UserContextType } from '../../../contexts';
import { IChannel } from '../../../interfaces';
import { socket } from '../../../socket';
import styles from './SearchBar.module.scss';

export const SearchBar: React.FC = () => {
  const [preview, setPreview] = useState<IChannel[]>([])
  const [input, setInput] = useState<string>("")
  const { user } = useContext(UserContext) as UserContextType;

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

  const handlePreviewClick = (channelId: string) => {
    socket.emit('wantJoin', { userId: user.id, channelId })
    setPreview([]);
    setInput("");
  }

  return (
    <div className={styles.SearchBar}>
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
                onClick={() => handlePreviewClick(channel.id)}
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
