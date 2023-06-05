import React from "react";
import { IUser } from "@/interfaces";

export type UserContextType = {
  user: IUser,
}

export const UserContext = React.createContext<UserContextType>({ user: { id: "", name: "", blocked: [], addedBy: [] }});
