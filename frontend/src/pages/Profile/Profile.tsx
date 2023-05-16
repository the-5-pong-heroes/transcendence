import React from "react";
import "./Profile.css";

import { useSignOut } from "../Login/hooks";

import { useUser } from "@hooks";

interface ProfileProps {
  profileRef: React.RefObject<HTMLDivElement>;
}

export const Profile: React.FC<ProfileProps> = ({ profileRef }) => {
  const { userAuth } = useUser();
  const signOut = useSignOut();

  return (
    <div ref={profileRef} id="Profile" className="Profile">
      <h1 className="profile-title">Profile</h1>
      {userAuth && (
        <button className="signOut-button" onClick={() => signOut()}>
          Sign out
        </button>
      )}
    </div>
  );
};
