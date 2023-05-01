import React, { useEffect, useState } from "react";
import "./Profile.css";

interface ProfileProps {
  profileRef: React.RefObject<HTMLDivElement>;
}

export const Profile: React.FC<ProfileProps> = ({ profileRef }) => {
  const [user, setUser] = useState("");

  const fetchUser = async () => {
    try {
      const resp = await fetch("http://localhost:3000/profile");
      const data = await resp.json();
      if (data)
        setUser(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div ref={profileRef} id="Profile" className="Profile">
      <div className="username">{user.name}</div>
      <div className="score">{user.score}</div>
      <div className="nbGames">{user.nbGames}</div>
      <div className="wins">{user.wins}</div>
      <div className="defeats">{user.defeats}</div>
      <div className="level">{user.level}</div>
      <div className="avatar">{user.avatar}</div>
      <div className="status">{user.status}</div>
      <div className="friend">{user.friend}</div>
    </div>
  );
};
