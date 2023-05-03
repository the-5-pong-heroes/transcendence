import React, { useEffect, useState } from "react";
import "./Profile.css";
import { DefaultAvatar } from "../../assets";
import { Plant, Walle, Eve, Energy } from "../../assets";


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
      <div className="row row1">
        <div className="col avatar">
          <img src={DefaultAvatar} alt="profilePicture" />
        </div>
        <div className="col username">
          {user.name}
        </div>
        <div className="col status">
          <span className={ user.status === 'ONLINE' ? "bullet-green" : (user.status === "PLAYING" ? 'bullet-orange' : 'bullet-red' ) }>
            { user.status !== "PLAYING" ? "•" : "◦" }
          </span>
          <span>{user.status}</span>
        </div>
      </div>
      <div className="row row2">
        <div className="col col-details">
          <span>Score: </span>
          <span>{user.score}</span>
        </div>
        <div className="col level">
          <img src={user.levelPicture} alt="levelPicture" />
          <span>{user.level}</span>
        </div>
        <div className="col col-details">
          <span>Ranking: </span>
          {/* TODO */}
          <span>17th</span>
        </div>
      </div>
      <div className="row row2">
        <div className="col col-details">
          <span>Wins: </span>
          <span>{user.wins}</span>
        </div>
        <div className="col col-details">
          <span>Defeats: </span>
          <span>{user.defeats}</span>
        </div>
        <div className="col col-details">
          <span>Games: </span>
          <span>{user.nbGames}</span>
        </div>
      </div>
      {/* <div className="friends">{user.friend}</div> */}
    </div>
  );
};
