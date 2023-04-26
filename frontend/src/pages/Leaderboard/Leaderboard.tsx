import React from "react";
import "./Leaderboard.css";
import UserData from "./UserData";

interface LeaderboardProps {
  boardRef: React.RefObject<HTMLDivElement>;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ boardRef }) => {
  const users = fetch("http://localhost:3000/test")
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json()
  })
  return (
    <div ref={boardRef} id="Leaderboard" className="Leaderboard">
      <div className="group">
        <h1 className="title">Leaderboard</h1>
        <table className="table-auto">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Username</th>
            <th>Score</th>
            <th>Wins</th>
            <th>Defeats</th>
            <th>Level</th>
            <th>Online</th>
            <th>Friend</th>
          </tr>
        </thead>
        <tbody>
          <UserData users={users} />
        </tbody>
      </table>
      </div>
    </div>
  );
};


{/* <div className="item">
<div className="Player">Bob</div>{" "}
  <div className="Infos">
  <span>1260pts</span>
    <span>Rank: 1</span>
    <span>V/D: 4</span>
    <span>Friends: Nope</span>
    <span>Team: Walle</span>
  </div>
</div>
<div className="item">
  <div className="Player">Marion</div>{" "}
  <div className="Infos">
    <span>832pts</span>
    <span>Rank: 2</span>
    <span>V/D: 2</span>
    <span>Friends: Yes</span>
    <span>Team: Eve</span>
    </div>
</div>
<div className="item">
  <div className="Player">Tom</div>{" "}
  <div className="Infos">
    <span>624pts</span>
    <span>Rank: 3</span>
    <span>V/D: 1</span>
    <span>Friends: Yes</span>
    <span>Team: Eve</span>
    </div>
  </div> */}
  {/* <div className="item" style={{ backgroundColor: "white" }}></div> */}
  {/* <div className="item" style={{ backgroundColor: "white" }}></div> */}
