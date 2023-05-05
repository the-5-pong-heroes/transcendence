import { DefaultAvatar } from "../../assets";
import { UserLevel } from "./UserLevel";
import { UserStatus } from "./UserStatus";

const UserData = ({users}: any) => {
  return (
    <>
      {
        users.map((curUser : any, i: number) => {
          const {avatar, name, score, wins, defeats, level, status, friend, ranking} = curUser;
          return (
            <div className="row" key={i}>
              <div className="col">
                <img src={DefaultAvatar} alt="profilePicture" />
              </div>
              <div className="col">{name}</div>
              <div className="col">{score}</div>
              <div className="col">{wins}</div>
              <div className="col">{defeats}</div>
              <UserLevel myClassName="col level" level={level} />
              <UserStatus myClassName="col status" status={status} />
              <div className="col">{friend}</div>
              <div className="col">{ranking}</div>
            </div>
          )
        })
      }
    </>
  )
}

export default UserData;
