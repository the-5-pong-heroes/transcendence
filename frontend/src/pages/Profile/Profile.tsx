import React, { useEffect, useState } from "react";
import "./Profile.css";
import { DefaultAvatar } from "../../assets";

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
          <span className="status-text">{user.status}</span>
        </div>
      </div>
      <div className="row row2">
        <div className="col score">
          {user.score}
        </div>
        <div className="col level">
          {/* user.level */}
          <img src={DefaultAvatar} alt="levelPicture" />
        </div>
        <div className="col ranking">
          {user.ranking}
        </div>
      </div>
      <div className="row">
        <div className="col wins">
          {user.wins}
        </div>
        <div className="col defeats">
          {user.defeats}
        </div>
        <div className="col nbGames">
          {user.nbGames}
        </div>
      </div>
      {/* <div className="friends">{user.friend}</div> */}
    </div>
  );
};
