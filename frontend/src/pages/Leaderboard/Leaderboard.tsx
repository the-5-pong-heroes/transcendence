import React from "react";
// import "./Leaderboard.css";

interface users {
  name: string;
  level: string;
  avatar: string;
  score: number;
}
export const Leaderboard: React.FC = () => {
  return (
    <div className="Leaderboard">
      <h1 className="title">Leaderboard</h1>
        <div className="group">
        <div className="item" style={{backgroundColor: "white"}}><div className="Bob">Bob</div> <div className="Infos"><span>1260</span><span>Walle</span></div></div>

        <div className="item" style={{backgroundColor: "white"}}>
		  Marion
	    </div>
        <div className="item" style={{backgroundColor: "white"}}></div>
        <div className="item" style={{backgroundColor: "white"}}></div>
        <div className="item" style={{backgroundColor: "white"}}></div>
      </div>
    </div>
  );
};

/*
<div className="item" style={{backgroundImage: "url(/src/assets/color-wall-e.png)"}}></div>
<div className="item" style={{backgroundImage: "url(/src/assets/color-wall-e.png)"}}></div>
<div className="item" style={{backgroundImage: "url(/src/assets/color-wall-e.png)"}}></div>
<div className="item" style={{backgroundImage: "url(/src/assets/color-wall-e.png)"}}></div>
<div className="item" style={{backgroundImage: "url(/src/assets/color-wall-e.png)"}}></div>
*/
