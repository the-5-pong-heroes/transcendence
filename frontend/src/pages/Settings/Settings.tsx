import React, { useEffect, useState } from "react";

import "./Settings.css";
import { DefaultAvatar, Leave } from "@/assets";
import { Unfollow } from "./Unfollow";
import Toggle2FA from "./Toggle2FA";


interface SettingsProps {
  settingsRef: React.RefObject<HTMLDivElement>;
}

export interface UserSettings {
  id: string;
  name: string;
  avatar: string | null;
  friends: { id: string; name: string }[];
  // 2FA
}


export const Settings: React.FC<SettingsProps> = ({ settingsRef }) => {

  const [settings, setSettings] = useState({} as UserSettings);

  const fetchSettings = async () => {
    try {
      const resp = await fetch("http://localhost:3000/settings");
      const data = await resp.json();
      if (data) setSettings(data)
    } catch (err) {
      console.error(err);
    }
  }

  function logout() {
    // TODO
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div ref={settingsRef} id="Settings" className="settings">
      {/* <h1>Custom your player!</h1> */}
      <div className="settings-header block1">
        <div className="avatar">
          <img src={DefaultAvatar} alt="profilePicture" />
        </div>
        <div className="column username">
          {settings.name}
          <img className="leave" src={Leave} onClick={() => { window.confirm( 'Are you sure you want to logout?', ) && logout() }}/>
        </div>
      </div>

      <div className="settings-block block2">
        <div className="settings-col update-username">
          Change your username:
          <input type="text" value={settings.name} />
        </div>
        <div className="settings-col update-avatar">
            Change your avatar:
          <button>Upload</button>
        </div>
        <div className="settings-col update-2fa">
          {/* <Toggle2FA settings={settings} /> */}
        </div>
      </div>
      <div className="settings-block block2">
        <Unfollow settings={settings} />
      </div>
    </div>
  );
};
