import React from "react";

import "./Settings.css";

interface SettingsProps {
  settingsRef: React.RefObject<HTMLDivElement>;
}

export const Settings: React.FC<SettingsProps> = ({ settingsRef }) => {
  return (
    <div ref={settingsRef} id="Settings" className="settings">
      <h1>Custom your player!</h1>
      <div className="username">
      </div>
      <div className="avatar">
      </div>
    </div>
  );
};
