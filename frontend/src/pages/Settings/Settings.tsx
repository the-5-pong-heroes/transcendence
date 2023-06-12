import React, { useEffect, useState } from "react";

import "./Settings.css";
import { useSignOut } from "../Login/hooks";

import { Unfollow } from "./Unfollow";
import { Toggle2FA } from "./Toggle2FA";

import { DefaultAvatar, Leave } from "@/assets";
import { LoadingIcon } from "@/components/loading/loading";
import { customFetch } from "@/helpers";
import { useUser } from "@hooks";
import { BASE_URL } from "@/constants";

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

  const twoFACode = React.useState("");
  const [isActivated, setIsActivated] = React.useState(false);

  async function handleFileChange(event: any): Promise<void> {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      try {
        setUploading(true);
        const response = await customFetch("POST", "upload", { file: file });
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
        const response = await customFetch("PATCH", "settings", { name: username });
        if (!response.ok) {
          alert("Your username must be unique and 3 to 20 characters long.");

          return;
        }
        const payload = await response.json();
        if (payload) {
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

  async function toggle2FA(isToggled: boolean) {
    console.log("2FA: ", isToggled);
    if (!isToggled) {
      const url = `${BASE_URL}` + "/auth/2FA/disable";
      window.open(url, "_self");
    } else {
      try {
        const data = await handle2FAfunction();
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function handle2FAfunction(): Promise<any> {
    const response = await customFetch("POST", "auth/2FA/generate", { code: twoFACode, twoFAactivated: isActivated });
    const data = await response.json();
    if (data.twoFAactivated === true) {
      openPopup(data.code);
    }

    return data;
  }

  function openPopup(twoFACode: string) {
    const popup = document.getElementById("popup");
    if (popup) {
      popup.style.display = "block";
      popup.dataset.twoFACode = twoFACode;
    }
  }

  function closePopup() {
    const popup = document.getElementById("popup");
    if (popup) {
      popup.style.display = "none";
      popup.removeAttribute("data-twoFACode");
    }
  }

  function submitVerificationCode() {
    const verificationCodeInput = document.getElementById("verificationCode") as HTMLInputElement;
    if (verificationCodeInput) {
      const verificationCode = verificationCodeInput.value;
      const popup = document.getElementById("popup");
      if (popup) {
        const twoFACode = popup.dataset.twoFACode;
        console.log("twoFA = ", twoFACode);
        console.log("verif = ", verificationCode);
        if (verificationCode === twoFACode) {
          alert("Code de vérification correct !");
          closePopup();
        } else {
          alert("Code de vérification incorrect. Veuillez réessayer.");
        }
      }
    }
  }

  if (!user) {
    return null;
  }

  const deleteUser = async (): Promise<void> => {
    void (await customFetch("DELETE", `users/${user?.id}`));
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
        <div id="popup" style={{ display: "none" }}>
          <h3>Entrez le code de vérification :</h3>
          <input type="text" id="verificationCode" style={{ color: "black" }} />
          <button className="walle-button" onClick={submitVerificationCode}>
            Valider
          </button>
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
