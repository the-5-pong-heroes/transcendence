import { Link } from "react-router-dom";
import { DefaultAvatar } from "../../assets";
import { UserStats } from "./Leaderboard";
import { UserLevel } from "./UserLevel";
import { UserStatus } from "./UserStatus";

const UserData = ({users}: {users: UserStats[]}) => {
  return (
    <div className="scroll-div">
      {
        users.map((curUser : UserStats, i: number) => {
          const {id, avatar, name, score, wins, defeats, level, status, isFriend, isMe, rank} = curUser;
          return (
            <div className={`row${isMe ? " me" : ""}`} key={i}>
              <div className="col">
                <img src={DefaultAvatar} alt="profilePicture" />
              </div>
              <div className="col"><Link to={`/profile/${id}`} className="link-prof">{name}</Link></div>
              <div className="col">{score}</div>
              <div className="col">{wins}</div>
              <div className="col">{defeats}</div>
              <UserLevel myClassName="col level" level={level} />
              <UserStatus myClassName="col status" status={status} />
              <div className="col">
                <span className={isFriend ? "friend" : "not-friend"}>{isFriend ? "✓" : (isMe ? "-" : "✗")}</span>
              </div>
              <div className="col">{rank}</div>
            </div>
          )
        })
      }
    </div>
  )
}

export default UserData;
