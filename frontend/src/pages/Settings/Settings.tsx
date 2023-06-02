import React, { useEffect, useState } from "react";

import "./Settings.css";
import { DefaultAvatar, Leave } from "@/assets";
import { Unfollow } from "./Unfollow";
import { LoadingIcon } from "@/components/loading/loading";


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

  const [settings, setSettings] = useState({name: ""} as UserSettings);

  const [username, setUsername] = useState(settings.name);

  const url = "http://localhost:3000/settings";

  const fetchSettings = async () => {
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      if (data) {
        setSettings(data);
        setUsername(data.name);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      try {
        const resp = await fetch(url, {
          method: 'PATCH',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json;charset=utf-8' },
          body: JSON.stringify({name: username})
        });
        if (!resp.ok) {
          alert("Your username must be unique and 3 to 20 characters long.");
          return;
        }
        const data = await resp.json();
        if (data)
          setSettings({...settings, name: username});
      } catch (err) {
        console.error(err);
      }
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
          <img src={settings.avatar ? settings.avatar : DefaultAvatar} alt="profilePicture" />
        </div>
        <div className="column username">
          {settings.name}
          <img className="leave" src={Leave} onClick={() => { window.confirm( 'Are you sure you want to logout?', ) && logout() }}/>
        </div>
      </div>

      <div className="settings-block block2">
        <div className="settings-col update-username">
          Change your username:
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={handleKeyDown} />
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
