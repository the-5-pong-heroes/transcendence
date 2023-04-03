import React from "react";
import "./Leaderboard.css";

interface users {
	name: string;
	level: string;
	avatar: string;
	score: number;
}
export const Leaderboard: React.FC = () => {
  return (
	<div id="Leaderboard" className="Leaderboard">
		<div className="group">
		  <h1 className="title">Leaderboard</h1>
		  <div className="item"><div className="Player">Bob</div> <div className="Infos"><span>1260pts</span><span>Rank: 1</span><span>V/D: 4</span><span>Friends: Nope</span><span>Team: Walle</span></div></div>
		  <div className="item"><div className="Player">Marion</div> <div className="Infos"><span>832pts</span><span>Rank: 2</span><span>V/D: 2</span><span>Friends: Yes</span><span>Team: Eve</span></div></div>
		  <div className="item"><div className="Player">Tom</div> <div className="Infos"><span>624pts</span><span>Rank: 3</span><span>V/D: 1</span><span>Friends: Yes</span><span>Team: Eve</span></div></div>
		  <div className="item" style={{backgroundColor: "white"}}></div>
		  <div className="item" style={{backgroundColor: "white"}}></div>
	</div>
    </div>
  );
};