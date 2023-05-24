import React from "react";
import { useQuery } from "react-query";

import { ClientEvents } from "@Game/@types";
import type { User } from "@types";
import { ResponseError } from "@/helpers";
import { useSocketContext, useUser } from "@hooks";
import { BASE_URL } from "@/constants";

import "./Chat.css";

async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new ResponseError("Failed on get user request", response);
  }
  const data: User[] = (await response.json()) as User[];

  return data;
}

export const ListOfUsers: React.FC = () => {
  const { socket } = useSocketContext();
  const { data, status } = useQuery<User[]>("users_query", fetchUsers);
  const { user } = useUser();
  const userId = user?.id;

  const sendInvite = (userId: string): void => {
    socket?.emit(ClientEvents.GameInvite, { userId: userId });
  };

  return (
    <div className="Users">
      {status === "error" && <p>Error fetching data</p>}
      {status === "loading" && <p>Fetching data...</p>}
      {status === "success" && (
        <div>
          {data.map(
            (user) =>
              user.id !== userId && (
                <div className="user-item" key={user.id}>
                  <div>
                    {user.name} [{user.status}]
                  </div>
                  <button onClick={() => sendInvite(user.id)}>Invite</button>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

interface ChatProps {
  chatRef: React.RefObject<HTMLDivElement>;
}

export const Chat: React.FC<ChatProps> = ({ chatRef }) => {
  return (
    <div ref={chatRef} id="Chat" className="chat">
      <h1 className="chat-title">Chat</h1>
      <ListOfUsers />
    </div>
  );
};
