/* eslint max-lines: ["warn", 300] */
import React, { useEffect, useState, Dispatch, SetStateAction } from "react";

import "./Profile.css";
import { useParams, Link } from "react-router-dom";

import { DefaultAvatar, Plant, Walle, Eve, Energy, Setting, addFriend, GameDark, ChatDark } from "../../assets";
import { UserStatus } from "../Leaderboard/UserStatus";
import { UserLevel } from "../Leaderboard/UserLevel";
import { type UserStats } from "../Leaderboard/Leaderboard";

import { MatchHistory } from "./MatchHistory";
import { Friends } from "./Friends";

import { InviteButton } from "@/components";
import { customFetch } from "@/helpers";

export interface GameData {
  playerOne: { id: string; name: string };
  playerOneScore: number;
  playerTwo: { id: string; name: string };
  playerTwoScore: number;
}

interface ProfileProps {
  profileRef: React.RefObject<HTMLDivElement>;
  setGoTo: Dispatch<SetStateAction<string>>;
}

export const Profile: React.FC<ProfileProps> = ({ profileRef, setGoTo }) => {
  const { uuid } = useParams();

  const [history, setHistory] = useState([] as GameData[]);

  const [user, setUser] = useState({} as UserStats);

  const [currentTab, setCurrentTab] = useState("Match history");

  const fetchHistory = async () => {
    try {
      const response = await customFetch("GET", `profile/history/${uuid ? uuid : ""}`);
      const payload = await response.json();
      if (payload) {
        setHistory(payload);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await customFetch("GET", `profile/${uuid ? uuid : ""}`);
      const payload = await response.json();
      if (payload) {
        const LEVELS: string[] = ["plant", "walle", "eve", "energy"];
        payload.levelPicture = [Plant, Walle, Eve, Energy][LEVELS.indexOf(payload.level)];
        payload.status = payload.status === "IN_GAME" ? "PLAYING" : payload.status;
        setUser(payload);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    profileRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
	if (user.isMe)
	  setGoTo("/Profile");
	else
	  setGoTo("/Profile/id");
    fetchUser();
    fetchHistory();
  }, [uuid]);

  if (!user) {
    return null;
  }

  async function followFriend(): Promise<void> {
    try {
      const body = { newFriendId: uuid };
      const data = await customFetch("POST", "friendship", body);
	  fetchUser();
    } catch (err) {
      console.error("Error adding a friend: ", err);
    }
  }

  return (
    <div ref={profileRef} id="Profile" className="Profile">
      <div className="profile-block block1">
        <div className="avatar">
          <img src={user.avatar ? user.avatar : DefaultAvatar} alt="profilePicture" />
        </div>
        <div className="column username">
          {user.name}
          <div className="username-icons">
            {user.isMe && (
              <Link to={"/Settings"}>
                <img src={Setting} id="settings-icon" />
              </Link>
            )}
            {!user.isMe && (
              <Link to={"/Chat"}>
                <img src={ChatDark} id="chat-icon" />
              </Link>
            )}
            {!user.isMe && (
              <InviteButton id={user.id}>
                <img src={GameDark} id="game-icon" />
              </InviteButton>
            )}
            {!user.isMe && !user.isFriend && (
              <img className="addpointer" src={addFriend} onClick={followFriend} id="friend-icon" />
            )}
          </div>
        </div>
        <UserStatus myClassName="column status" status={user.isMe ? "ONLINE" : user.status} />
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
          <li
            className={`tab-item${currentTab === "Match history" ? " tab-active" : ""}`}
            onClick={() => {
              setCurrentTab("Match history");
            }}>
            <div className="tab-link">Match history</div>
          </li>
          <li
            className={`tab-item${currentTab === "Friends" ? " tab-active" : ""}`}
            onClick={() => {
              setCurrentTab("Friends");
            }}>
            <div className="tab-link">Friends</div>
          </li>
        </ul>
        {currentTab === "Match history" ? <MatchHistory history={history} /> : <Friends user={user} />}
      </div>
    </div>
  );
};
