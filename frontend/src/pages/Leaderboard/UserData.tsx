import { useNavigate } from 'react-router-dom';
import { DefaultAvatar } from "../../assets";

import { type UserStats } from "./Leaderboard";
import { UserLevel } from "./UserLevel";
import { UserStatus } from "./UserStatus";

const UserData = ({ users }: { users: UserStats[] }) => {
  const navigate = useNavigate();

  const handleClick = (id: string): void => {
    navigate(`/Profile/${id}`);
  }

  return (
    <div className="scroll-div">
      {users.map((curUser: UserStats, i: number) => {
        const { id, avatar, name, score, wins, defeats, level, status, isFriend, isMe, rank } = curUser;

        return (
          <div className={`row${isMe ? " me" : ""}`} key={i}>
            <div className="col avatar">
              <img src={avatar ? avatar : DefaultAvatar} alt="profilePicture" />
            </div>
            <div className="col name">
              <div onClick={() => handleClick(id)} className="link-prof">
                {name}
              </div>
            </div>
            <div className="col score">{score}</div>
            <div className="col wins ">{wins}</div>
            <div className="col defeats">{defeats}</div>
            <UserLevel myClassName="col level" level={level} />
            <UserStatus myClassName="col status" status={isMe ? "ONLINE": status} />
            <div className="col friends">
              <span className={isFriend ? "friend" : "not-friend"}>{isFriend ? "✓" : isMe ? "-" : "✗"}</span>
            </div>
            <div className="col">{rank}</div>
          </div>
        );
      })}
    </div>
  );
};

export default UserData;
