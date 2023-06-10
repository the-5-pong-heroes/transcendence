import React, { useEffect, useState } from "react";

import "./Settings.css";
import { useSignOut } from "../Login/hooks";

import { Unfollow } from "./Unfollow";
import { Toggle2FA } from "./Toggle2FA";

import { DefaultAvatar, Leave } from "@/assets";
import { LoadingIcon } from "@/components/loading/loading";
import { customFetch } from "@/helpers";
import { useUser } from "@hooks";

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
  const [uploading, setUploading] = useState(false);

  const [settings, setSettings] = useState({ name: "" } as UserSettings);

  const [username, setUsername] = useState(settings.name);

  const [avatar, setAvatar] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const signOut = useSignOut();
  const user = useUser();

  const url = "http://localhost:3333/settings";

  async function handleFileChange(event: any) {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        setUploading(true);
        const response = await fetch(url + "/upload", {
          credentials: "include",
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setAvatar(data.avatar);
        setUploading(false);
      } catch (err) {
        console.error("Error uploading image: ", err);
      }
    }
  }

  const fetchSettings = async () => {
    try {
      const resp = await fetch(url, { credentials: "include" });
      const data = await resp.json();
      if (data) {
        setSettings(data);
        setUsername(data.name);
        setAvatar(data.avatar);
      }
    } catch (err) {
      console.error(err);
    }
  };

  async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      try {
        const resp = await fetch(url, {
          method: "PATCH",
          headers: { Accept: "application/json", "Content-Type": "application/json;charset=utf-8" },
          body: JSON.stringify({ name: username }),
          credentials: "include",
        });
        if (!resp.ok) {
          alert("Your username must be unique and 3 to 20 characters long.");

          return;
        }
        const data = await resp.json();
        if (data) {
          setSettings({ ...settings, name: username });
        }
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

  function toggle2FA(isToggled: boolean) {
    console.log("2FA: ", isToggled);
  }

  if (!user) {
    return null;
  }

  const deleteUser = (): void => {
    customFetch<void>("remove", `/users/${user?.id}`).catch((error) => {
      console.error(error);
    });
    signOut();
  };

  useEffect(() => {
    fetchSettings();
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
          <Toggle2FA toggled={true} onClick={toggle2FA} />
        </div>
      </div>
      <div className="settings-block block2">
        <Unfollow friends={settings.friends} handleUnfollow={handleUnfollow} />
      </div>
      <div className="settings-footer">
        <button className="delete-button" onClick={deleteUser}>
          Delete my account
        </button>
      </div>
    </div>
  );
};
