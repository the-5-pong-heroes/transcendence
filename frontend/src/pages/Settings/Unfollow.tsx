import { Link } from "react-router-dom";
import React from "react";

import "../Profile/Profile.css";
import { BASE_URL } from "@/constants";
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
      customFetch<void>("DELETE", "/friendship", { friendId: uuid }).catch(() => {
        console.error("Failed to remove this friend!");
      });
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
              data-friend={friend.id}
              className="cross"
              // onClick={async () => {
              //   await removeFriend(friend.id);
              onClick={() => removeFriend(friend.id)}>
              ✗
            </span>
          </div>
        );
      })}
    </div>
  );
};
