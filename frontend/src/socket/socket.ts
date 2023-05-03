import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000', {
  extraHeaders: {
    Authorization: `Bearer ${window.localStorage.getItem('access_token')}`
  }
});
