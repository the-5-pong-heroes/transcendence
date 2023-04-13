import React from "react";
import "./Profile.css";

interface ProfileProps {
  profileRef: React.RefObject<HTMLDivElement>;
}

export const Profile: React.FC<ProfileProps> = ({ profileRef }) => {
  return (
    <div ref={profileRef} id="Profile" className="Profile">
      <h1 className="profile-title">Profile</h1>
    </div>
  );
};
