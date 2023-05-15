import React, { useEffect, useState } from "react";
import "./Profile.css";
import { DefaultAvatar } from "../../assets";
import { Plant, Walle, Eve, Energy } from "../../assets";
import { UserStatus } from "../Leaderboard/UserStatus";
import { UserLevel } from "../Leaderboard/UserLevel";
import { MatchHistory } from "./MatchHistory";
import { useParams } from "react-router-dom";


interface ProfileProps {
  profileRef: React.RefObject<HTMLDivElement>;
}

export const Profile: React.FC<ProfileProps> = ({ profileRef }) => {

  const { uuid } = useParams();

  const [history, setHistory] = useState([]);

  const [user, setUser] = useState("");


  const fetchHistory = async () => {
    try {
      const resp = await fetch(`http://localhost:3000/profile/history/${uuid ? uuid : ""}`);
      const data = await resp.json();
      if (data) setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUser = async () => {
    try {
      const resp = await fetch(`http://localhost:3000/profile/${uuid ? uuid : ""}`);
      const data = await resp.json();
      if (data) {
        const LEVELS: string[] = ["plant", "walle", "eve", "energy"];
        data.levelPicture = [Plant, Walle, Eve, Energy][LEVELS.indexOf(data.level)];
        data.status = (data.status === "IN_GAME" ? "PLAYING" : data.status);
        setUser(data)
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchHistory();
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
        <UserLevel myClassName="column level" level={user.level} />
        <div className="column column-details">
          <span>Ranking: </span>
          <span>{user.rank}</span>
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
      <MatchHistory history={history} />
      {/* <div className="friends">{user.friend}</div> */}
    </div>
  );
};
