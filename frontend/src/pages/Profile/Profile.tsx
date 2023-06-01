import React from "react";
import "./Profile.css";

import { useSignOut } from "../Login/hooks";

import { useUser } from "@hooks";
import * as fetch from "@/helpers/fetch";

interface ProfileProps {
  profileRef: React.RefObject<HTMLDivElement>;
}

export const Profile: React.FC<ProfileProps> = ({ profileRef }) => {
  const { user } = useUser();
  const signOut = useSignOut();
  if (!user) {
    return null;
  }

  const deleteUser = (): void => {
    fetch.remove<void>(`/users/${user.id}`).catch((error) => {
      console.error(error);
    });
    signOut();
  };

  return (
    <div ref={profileRef} id="Profile" className="Profile">
      <h1 className="profile-title">{user.name}</h1>
      <button className="signOut-button" onClick={() => signOut()}>
        Sign out
      </button>
      <button className="delete-button" onClick={deleteUser}>
        Delete my account
      </button>
    </div>
  );
};
