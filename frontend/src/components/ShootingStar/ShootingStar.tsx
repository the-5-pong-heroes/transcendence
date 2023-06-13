import React, { useEffect, useState } from "react";

import "./ShootingStar.css";

export const ShootingStar: React.FC = () => {
  return (
    <div className="shooting-star-container">
      <div className="shooting-star one" style={{ top: "100px", right: "-10px", width: "45px" }}></div>
      <div className="shooting-star two" style={{ top: "100px", right: "-300px", width: "45px" }}></div>
      <div className="shooting-star three" style={{ top: "0", left: "0", width: "55px" }}></div>
    </div>
  );
};
