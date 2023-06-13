import React from "react";

import "./LoadingPage.css";

export const LoadingPage: React.FC = () => {
  return (
    <div className="loading-page">
      <div className="loading-wheel"></div>
      <div>
        Loading
        <span className="jumping-dots">
          <span className="dot-1">.</span>
          <span className="dot-2">.</span>
          <span className="dot-3">.</span>
        </span>
      </div>
    </div>
  );
};
