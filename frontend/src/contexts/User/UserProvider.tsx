import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { IUser } from "@/interfaces";
import { socket } from "@/socket";
import { ResponseError } from "@/helpers";

interface ProviderParameters {
  children: React.ReactNode;
}

export const UserProvider: React.FC<ProviderParameters> = ({ children }) => {
  const [user, setUser] = useState<IUser>({ id: "", name: "", blocked: [], addedBy: [] });
  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchData = async () => {
      // const token = localStorage.getItem("access_token");
      // if (!token) return navigate("/Login");
      // const config = { headers: { "Authorization": token } };
      const config = { credentials: "include" as RequestCredentials};
      const response = await fetch("http://localhost:3000/users/me", config);
      if (!response.ok) {
        throw new ResponseError("Failed on fetch channels request", response);
        // localStorage.setItem("access_token", "");
        // return; // Set Error Message
      }
      const data = await response.json();
      setUser(data);
    }

    fetchData();

    socket.on("reloadUser", fetchData);

    return () => {
      socket.off("reloadUser", fetchData);
    }
  }, []);

  return <UserContext.Provider value={{user}}>{children}</UserContext.Provider>;
};
