import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Profile.css";

import { useSignOut } from "../Login/hooks";
import { DefaultAvatar, Plant, Walle, Eve, Energy } from "../../assets";
import { UserStatus } from "../Leaderboard/UserStatus";
import { UserLevel } from "../Leaderboard/UserLevel";
import { type UserStats } from "../Leaderboard/Leaderboard";

import { MatchHistory } from "./MatchHistory";

// import * as customFetch from "@/helpers/fetch";

export interface GameData {
  playerOne: { id: string; name: string };
  playerOneScore: number;
  playerTwo: { id: string; name: string };
  playerTwoScore: number;
}

interface ProfileProps {
  profileRef: React.RefObject<HTMLDivElement>;
}

// export const Profile: React.FC<ProfileProps> = ({ profileRef }) => {
//   const { uuid } = useParams();

//   const [history, setHistory] = useState([] as GameData[]);

//   const [user, setUser] = useState({} as UserStats);

//   const fetchHistory = async () => {
//     try {
//       const resp = await fetch(`http://localhost:3000/profile/history/${uuid ? uuid : ""}`);
//       const data = await resp.json();
//       if (data) setHistory(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchUser = async () => {
//     try {
//       const resp = await fetch(`http://localhost:3000/profile/${uuid ? uuid : ""}`);
//       const data = await resp.json();
//       if (data) {
//         const LEVELS: string[] = ["plant", "walle", "eve", "energy"];
//         data.levelPicture = [Plant, Walle, Eve, Energy][LEVELS.indexOf(data.level)];
//         data.status = data.status === "IN_GAME" ? "PLAYING" : data.status;
//         setUser(data);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const signOut = useSignOut();
//   const deleteUser = (): void => {
//     customFetch.remove<void>(`/users/${user.id}`).catch((error) => {
//       console.error(error);
//     });
//     signOut();
//   };

//   useEffect(() => {
//     fetchUser();
//     fetchHistory();
//   }, []);

//   return (
//     <div ref={profileRef} id="Profile" className="Profile">
//       <div className="profile-block block1">
//         <div className="avatar">
//           <img src={DefaultAvatar} alt="profilePicture" />
//         </div>
//         <div className="column username">{user.name}</div>
//         <UserStatus myClassName="column status" status={user.status} />
//       </div>
//       <div className="profile-block block2">
//         <div className="column column-details">
//           <span>Score: </span>
//           <span>{user.score}</span>
//         </div>
//         <UserLevel myClassName="column level" level={user.level} />
//         <div className="column column-details">
//           <span>Ranking: </span>
//           <span>{user.rank}</span>
//         </div>
//       </div>
//       <div className="profile-block block2">
//         <div className="column column-details">
//           <span>Wins: </span>
//           <span>{user.wins}</span>
//         </div>
//         <div className="column column-details">
//           <span>Defeats: </span>
//           <span>{user.defeats}</span>
//         </div>
//         <div className="column column-details">
//           <span>Games: </span>
//           <span>{user.nbGames}</span>
//         </div>
//       </div>
//       <MatchHistory history={history} />
//       {/* <div className="friends">{user.friend}</div> */}
//       <div className="profile-footer">
//         <button className="signOut-button" onClick={() => signOut()}>
//           Sign out
//         </button>
//         <button className="delete-button" onClick={deleteUser}>
//           Delete my account
//         </button>
//       </div>
//     </div>
//   );
// };

import { useUser } from "@hooks";
import * as fetch from "@/helpers/fetch";

export const Profile: React.FC<ProfileProps> = ({ profileRef }) => {
  const { user } = useUser();
  const signOut = useSignOut();

  if (!user) {
    return null;
  }
  const deleteUser = (): void => {
    fetch.remove<void>(`/users/${user?.id}`).catch((error) => {
      console.error(error);
    });
    signOut();
  };

  return (
    <div ref={profileRef} id="Profile" className="Profile">
      <h1 className="profile-title">{user.name}</h1>
      <button className="signOut-button" onClick={() => signOut()}>
        Sign out
      </button>
      <button className="delete-button" onClick={deleteUser}>
        Delete my account
      </button>
    </div>
  );
};
