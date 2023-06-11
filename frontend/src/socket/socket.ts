import { io } from "socket.io-client";

export const socket = io("http://localhost:3333", {
  extraHeaders: {
    Authorization: `${window.localStorage.getItem("access_token")}`,
  },
});
