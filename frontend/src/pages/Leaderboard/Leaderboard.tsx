import React, { useEffect, useState } from "react";
import "./Leaderboard.css";
import UserData from "./UserData";

interface LeaderboardProps {
  boardRef: React.RefObject<HTMLDivElement>;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ boardRef }) => {
  const [users, setUSers] = useState([]);

  const fetchUsers = async () => {
    try {
      const resp = await fetch("http://localhost:3000/leaderboard");
      const data = await resp.json();
      if (data.length > 0) {
        setUSers(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div ref={boardRef} id="Leaderboard" className="Leaderboard">
      <div className="group">
        <h1 className="title">Leaderboard</h1>
        <table className="table-auto">
        <thead>
          <tr>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Avatar</th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Username</th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Score</th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Wins</th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Defeats</th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Level</th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Online</th>
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Friend</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800">
          <UserData users={users} />
        </tbody>
      </table>
      </div>
    </div>
  );
};
