import { useEffect } from "react";
import { Link } from "react-router-dom";

import { type UserStats } from "../Leaderboard/Leaderboard";
import "./Profile.css";

export const Friends = ({ user }: { user: UserStats }) => {
  if (!user || !user.friends || user.friends.length == 0) {
    return (
      <div className="noFriendYet">
        <span>No friend yet! 🤷‍♀️</span>
      </div>
    );
  }

  return (
    <div>
      {user.friends.map((friend: { name: string; id: string }, i: number) => {
        return (
          <div key={i} className="friends-list">
            <Link to={`/profile/${friend.id}`}>
              <span>{friend.name}</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
