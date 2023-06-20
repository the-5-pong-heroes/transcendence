/* eslint max-lines: ["warn", 300] */
import React, { useEffect, useState } from "react";

import "./Profile.css";
import { useParams, Link } from "react-router-dom";

import { DefaultAvatar, Plant, Walle, Eve, Energy, Setting, addFriend, GameLight, ChatLight } from "../../assets";
import { UserStatus } from "../Leaderboard/UserStatus";
import { UserLevel } from "../Leaderboard/UserLevel";
import { type UserStats } from "../Leaderboard/Leaderboard";

import { MatchHistory } from "./MatchHistory";
import { Friends } from "./Friends";

import { useSocket } from "@hooks";
import { ClientEvents } from "@Game/@types";

import { customFetch } from "@/helpers";


export interface GameData {
  playerOne: { id: string; name: string };
  playerOneScore: number;
  playerTwo: { id: string; name: string };
  playerTwoScore: number;
}

interface ProfileProps {
  profileRef: React.RefObject<HTMLDivElement>;
}

export const Profile: React.FC<ProfileProps> = ({ profileRef }) => {
  const { uuid } = useParams();

  const socket = useSocket();

  const [history, setHistory] = useState([] as GameData[]);

  const [user, setUser] = useState({} as UserStats);

  const [currentTab, setCurrentTab] = useState("Match history");

  const fetchHistory = async () => {
    try {
      const resp = await customFetch("GET", `profile/history/${uuid ? uuid : ""}`);
      const data = await resp.json();
      if (data) {
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUser = async () => {
    try {
      const resp = await customFetch("GET", `profile/${uuid ? uuid : ""}`);
      const data = await resp.json();
      if (data) {
        const LEVELS: string[] = ["plant", "walle", "eve", "energy"];
        data.levelPicture = [Plant, Walle, Eve, Energy][LEVELS.indexOf(data.level)];
        data.status = data.status === "IN_GAME" ? "PLAYING" : data.status;
        setUser(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchHistory();
  }, [uuid]);

  if (!user) {
    return null;
  }

  function switchTab(event: any) {
    const tabText: string = event.target.innerText;
    if (tabText === "Match history") {
      setCurrentTab("Match history");
    } else {
      setCurrentTab("Friends");
    }
  }

  async function followFriend() {
    const url = "http://localhost:3333";
    try {
      console.log("uuid", uuid);
      const response = await fetch(url + "/friendship", {
        method: "POST",
        body: JSON.stringify({ newFriendId: uuid }),
        credentials: "include",
      });
      const data = await response.json();
    } catch (err) {
      console.error("Error adding a friend: ", err);
    }
  }

  const inviteToPlay = (id?: string): void => {
    console.log("🏓", id);
    if (!id) {
      return;
    }
    socket.emit(ClientEvents.GameInvite, { userId: id });
  };

  return (
    <div ref={profileRef} id="Profile" className="Profile">
      <div className="profile-block block1">
        <div className="avatar">
          <img src={user.avatar ? user.avatar : DefaultAvatar} alt="profilePicture" />
        </div>
        <div className="column username">
          {user.name}
          {user.isMe && (
            <Link to={"/Settings"}>
              <img src={Setting} />
            </Link>
          )}
          {!user.isMe && (
            <Link to={"/Chat"}>
              <img src={ChatLight} />
            </Link>
          )}
          {!user.isMe && (
            // <Link to={"/Game"}>
            //   <img src={GameLight} />
            // </Link>
            <button onClick={() => inviteToPlay(user.id)}>
              <img src={GameLight} />
            </button>
          )}
          {!user.isMe && !user.isFriend && <img className="addpointer" src={addFriend} onClick={followFriend} />}
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
      <div className="block3">
        <ul className="tab tabs">
          <li className={`tab-item${currentTab === "Match history" ? " tab-active" : ""}`} onClick={switchTab}>
            <div className="tab-link">Match history</div>
          </li>
          <li className={`tab-item${currentTab === "Friends" ? " tab-active" : ""}`} onClick={switchTab}>
            <div className="tab-link">Friends</div>
          </li>
        </ul>
        {currentTab === "Match history" ? <MatchHistory history={history} /> : <Friends user={user} />}
      </div>
    </div>
  );
};
