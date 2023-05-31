import { UserStats } from "../Leaderboard/Leaderboard"

export const Friends = ({user} :{user: UserStats} ) => {
  if (!user || !user.friends || user.friends.length == 0) {
    return (
      <div className="noMatchYet">
        <span>No friend yet! 🤷‍♀️</span>
      </div>
    )
  }

return (
  <div>
    {
      user.friends.map((friend : {name: string, id: string}, i: number) => {
        return (
          <div key={i} className="friends-list">{friend.name}</div>
        )
      })
    }
  </div>
  )
}
