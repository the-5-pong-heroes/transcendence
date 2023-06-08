import { Link } from "react-router-dom";
import { useState } from "react";

import { UserSettings } from "./Settings";
import "../Profile/Profile.css";

export const Unfollow = ({
  friends,
  handleUnfollow,
}: {
  friends: { id: string; name: string }[];
  handleUnfollow: (friendId: string) => void;
}) => {
  if (!friends || friends.length == 0) {
    return (
      <div className="noFriendYet">
        <span>No friend yet! 🤷‍♀️</span>
      </div>
    );
  }

  async function removeFriend(uuid: string) {
    const url = "http://localhost:3000";
    try {
      handleUnfollow(uuid);
      const response = await fetch(url + "/friendship", {
        method: "DELETE",
        body: JSON.stringify({ friendId: uuid }),
        credentials: "include",
      });
      const data = await response.json();
    } catch (err) {
      console.error("Error removing friend: ", err);
    }
  }

  return (
    <div className="settings-col">
      {friends.map((friend: { name: string; id: string }, i: number) => {
        return (
          <div key={i} className="friends-list">
            <Link to={`/Profile/${friend.id}`}>
              <span>{friend.name}</span>
            </Link>
            <span
              className="cross"
              onClick={() => {
                window.confirm("Are you sure you want to remove this friend?") && removeFriend(friend.id);
              }}>
              ✗
            </span>
          </div>
        );
      })}
    </div>
  );
};
