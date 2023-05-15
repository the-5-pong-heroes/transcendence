import { DefaultAvatar } from "../../assets";
import { UserLevel } from "./UserLevel";
import { UserStatus } from "./UserStatus";

const UserData = ({users}: any) => {
  return (
    <div className="scroll-div">
      {
        users.map((curUser : any, i: number) => {
          const {avatar, name, score, wins, defeats, level, status, friend, isMe, rank} = curUser;
          return (
            <div className={`row${isMe ? " me" : ""}`} key={i}>
              <div className="col">
                <img src={DefaultAvatar} alt="profilePicture" />
              </div>
              <div className="col">{name}</div>
              <div className="col">{score}</div>
              <div className="col">{wins}</div>
              <div className="col">{defeats}</div>
              <UserLevel myClassName="col level" level={level} />
              <UserStatus myClassName="col status" status={status} />
              <div className="col">
                <span className={friend ? "friend" : "not-friend"}>{friend ? "✓" : (isMe ? "-" : "✗")}</span>
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
