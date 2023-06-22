import { Link } from "react-router-dom";
import React from "react";

import "../Profile/Profile.css";
import { customFetch } from "@/helpers";

interface UnfollowProps {
  friends: { id: string; name: string }[];
  handleUnfollow: (friendId: string) => void;
}

export const Unfollow: React.FC<UnfollowProps> = ({ friends, handleUnfollow }) => {
  if (!friends || friends.length == 0) {
    return (
      <div className="noFriendYet">
        <span>No friend yet! 🤷‍♀️</span>
      </div>
    );
  }

  function removeFriend(uuid: string): void {
    if (window.confirm("Are you sure you want to remove this friend?")) {
      handleUnfollow(uuid);

      return void customFetch("PUT", "friendship", { friendId: uuid });
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
                removeFriend(friend.id);
              }}>
              ✗
            </span>
          </div>
        );
      })}
    </div>
  );
};
