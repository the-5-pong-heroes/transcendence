import React, { useEffect, useState } from "react";
import "./Leaderboard.css";
import UserData from "./UserData";

interface LeaderboardProps {
  boardRef: React.RefObject<HTMLDivElement>;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ boardRef }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const resp = await fetch("http://localhost:3000/leaderboard");
      const data = await resp.json();
      if (data.length > 0) {
        setUsers(data);
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
      <div className="row firstRow">
        <div className="col">Avatar</div>
        <div className="col">Username</div>
        <div className="col">Score</div>
        <div className="col">Wins</div>
        <div className="col">Defeats</div>
        <div className="col">Level</div>
        <div className="col">Status</div>
        <div className="col">Friend</div>
        <div className="col">Ranking</div>
      </div>
      <UserData users={users} />
    </div>
  );
};

  {/* <h1 className="title">Leaderboard</h1> */}
