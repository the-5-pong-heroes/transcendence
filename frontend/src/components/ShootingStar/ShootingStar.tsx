import React from "react";

import "./ShootingStar.css";

export const ShootingStar: React.FC = () => {
  return (
    <div className="shooting-star-container">
      <div className="shooting-star one" style={{ top: "50px", left: "50px", width: "55px" }}></div>
      <div
        className="shooting-star two"
        style={{ top: "20px", left: "calc((548vh - 100vw) / 4 * 2", width: "45px" }}></div>
      <div className="shooting-star three" style={{ top: "200px", right: "100px", width: "40px" }}></div>
    </div>
  );
};
