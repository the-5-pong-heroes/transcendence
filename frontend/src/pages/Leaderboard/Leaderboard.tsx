import React, { useEffect, useState, Dispatch, SetStateAction } from "react";

import "./Leaderboard.css";
import UserData from "./UserData";

import { customFetch } from "@/helpers";

interface LeaderboardProps {
  boardRef: React.RefObject<HTMLDivElement>;
  setGoTo: Dispatch<SetStateAction<string>>;
}

export interface UserStats {
  id: string;
  name: string;
  avatar: string | null;
  status: string;
  lastLogin: null | Date;
  createdAt: Date;
  updatedAt: Date;
  rank: number;
  score: number;
  wins: number;
  defeats: number;
  nbGames: number;
  friends: { name: string; id: string }[];
  level: string;
  isFriend: boolean;
  isMe: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ boardRef, setGoTo }) => {
  const [users, setUsers] = useState([] as UserStats[]);

  const fetchUsers = async () => {
    try {
      const response = await customFetch("GET", "leaderboard");
      const payload = await response.json();
      if (payload.length > 0) {
        setUsers(payload);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
	setGoTo("/Leaderboard");
  }, []);

  return (
    <div ref={boardRef} id="Leaderboard" className="Leaderboard">
      <div className="row firstRow">
        <div className="col avatar">Avatar</div>
        <div className="col">Username</div>
        <div className="col score">Score</div>
        <div className="col wins">Wins</div>
        <div className="col defeats">Defeats</div>
        <div className="col level">Level</div>
        <div className="col status">Status</div>
        <div className="col friends">Friend</div>
        <div className="col">Ranking</div>
      </div>
      <UserData users={users} />
    </div>
  );
};
