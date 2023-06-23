import React, { useEffect, useState, Dispatch, SetStateAction } from "react";

import "./Settings.css";
import { useSignOut } from "../Login/hooks";

import { Unfollow } from "./Unfollow";
import { Toggle2FA } from "./Toggle2FA";
import { useChangeName } from "./useChangeName";

import { DefaultAvatar, Leave } from "@/assets";
import { LoadingIcon } from "@/components/loading/loading";
import { customFetch } from "@/helpers";
import { useUser } from "@hooks";
import { BASE_URL } from "@/constants";

interface SettingsProps {
  settingsRef: React.RefObject<HTMLDivElement>;
  setGoTo: Dispatch<SetStateAction<string>>;
}

export interface UserSettings {
  id: string;
  name: string;
  avatar: string | null;
  friends: { id: string; name: string }[];
}

export const Settings: React.FC<SettingsProps> = ({ settingsRef, setGoTo }) => {
  const [uploading, setUploading] = useState(false);

  const [settings, setSettings] = useState({ name: "" } as UserSettings);

  const [username, setUsername] = useState(settings.name);

  const [avatar, setAvatar] = useState(null);

  const signOut = useSignOut();
  const user = useUser();
  const changeName = useChangeName({ settings, setSettings });

  async function handleFileChange(event: any) {
    if (!event.target.files) {
      return;
    }
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        setUploading(true);
        const uploadUrl = BASE_URL + "/settings/upload";
        const response = await fetch(uploadUrl, { method: "POST", body: formData, credentials: "include" });
        const payload = await response.json();
        setAvatar(payload.avatar);
        setUploading(false);
      } catch (err) {
        console.error("Error uploading image: ", err);
      }
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await customFetch("GET", "settings");
      const payload = await response.json();
      if (payload) {
        setSettings(payload);
        setUsername(payload.name);
        setAvatar(payload.avatar);
      }
    } catch (err) {
      console.error(err);
    }
  };

  async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      try {
        changeName({ name: username });
        // const response = await customFetch("PATCH", "settings", { name: username });
        // if (!response.ok) {
        //   alert("Your username must be unique and 3 to 20 characters long.");

        //   return;
        // }
        // const payload = await response.json();
        // if (payload) {
        //   console.log("payload: ", payload);
        //   setSettings({ ...settings, name: username });
        // }
      } catch (err) {
        console.error(err);
      }
    }
  }

  function handleUnfollow(friendId: string) {
    const updatedFriends = settings.friends.filter((friend) => friend.id !== friendId);
    setSettings((prevSettings) => ({
      ...prevSettings,
      friends: updatedFriends,
    }));
  }

  if (!user) {
    return null;
  }

  useEffect(() => {
    fetchSettings();
	setGoTo("/Settings");
  }, []);

  return (
    <div ref={settingsRef} id="Settings" className="settings">
      {/* <h1>Custom your player!</h1> */}
      <div className="settings-header block1">
        <div className="avatar">
          <img src={avatar ? avatar : DefaultAvatar} alt="profilePicture" />
          {uploading ? <LoadingIcon /> : null}
        </div>
        <div className="column username">
          {settings.name}
          <img
            className="leave"
            src={Leave}
            onClick={() => {
              window.confirm("Are you sure you want to logout?") && signOut();
            }}
          />
        </div>
      </div>

      <div className="settings-block block2">
        <div className="settings-col update-username">
          Change your username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={handleKeyDown} />
        </div>
        <div className="settings-col update-avatar">
          Change your avatar:
          <label className="custom-file-upload">
            <input type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} /> Select an image
          </label>
        </div>
        <div className="settings-col update-2fa">
          <Toggle2FA />
        </div>
      </div>
      <div className="settings-block block2">
        <Unfollow friends={settings.friends} handleUnfollow={handleUnfollow} />
      </div>
    </div>
  );
};
