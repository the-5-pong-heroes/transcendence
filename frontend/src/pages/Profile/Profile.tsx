import React, { useEffect, useState } from "react";
import "./Profile.css";
import { DefaultAvatar } from "../../assets";
import { Plant, Walle, Eve, Energy } from "../../assets";
import { UserStatus } from "../Leaderboard/UserStatus";


interface ProfileProps {
  profileRef: React.RefObject<HTMLDivElement>;
}

export const Profile: React.FC<ProfileProps> = ({ profileRef }) => {


  const [user, setUser] = useState("");

  const fetchUser = async () => {
    try {
      const resp = await fetch("http://localhost:3000/profile");
      const data = await resp.json();
      if (data) {
        const LEVELS: string[] = ["plant", "walle", "eve", "energy"];
        data.levelPicture = [Plant, Walle, Eve, Energy][LEVELS.indexOf(data.level)];
        data.status = (data.status === "IN_GAME" ? "PLAYING" : data.status);
        setUser(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div ref={profileRef} id="Profile" className="Profile">
      <div className="profile-block block1">
        <div className="avatar">
          <img src={DefaultAvatar} alt="profilePicture" />
        </div>
        <div className="column username">
          {user.name}
        </div>
        <UserStatus myClassName="column status" status={user.status} />
      </div>
      <div className="profile-block block2">
        <div className="column column-details">
          <span>Score: </span>
          <span>{user.score}</span>
        </div>
        <div className="column level">
          <img src={user.levelPicture} alt="levelPicture" />
          <span>{user.level}</span>
        </div>
        <div className="column column-details">
          <span>Ranking: </span>
          {/* TODO */}
          <span>17th</span>
        </div>
      </div>
      <div className="profile-block block2">
        <div className="column column-details">
          <span>Wins: </span>
          <span>{user.wins}</span>
        </div>
        <div className="column column-details">
          <span>Defeats: </span>
          <span>{user.defeats}</span>
        </div>
        <div className="column column-details">
          <span>Games: </span>
          <span>{user.nbGames}</span>
        </div>
      </div>
      {/* <div className="friends">{user.friend}</div> */}
    </div>
  );
};
