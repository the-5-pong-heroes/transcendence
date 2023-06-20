import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "./UserContext";

import { type IUser } from "@/interfaces";
// import { socket } from "@/socket";
import { ResponseError, customFetch } from "@/helpers";
import { useSocket } from "@hooks";
import type { SocketParameters } from "@types";

interface ProviderParameters {
  children: React.ReactNode;
}

export const UserProvider: React.FC<ProviderParameters> = ({ children }) => {
  const [user, setUser] = useState<IUser>({ id: "", name: "", blocked: [], addedBy: [] });
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      const response = await customFetch("GET", "users/me");

      if (!response.ok) {
        throw new ResponseError("Failed on fetch channels request", response);
      }
      const data = await response.json();
      setUser(data);
    };

    fetchData().catch((e) => console.log(e));

    socket.on("reloadUser", fetchData);

    return () => {
      socket.off("reloadUser", fetchData);
    };
  }, [socket]);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};
