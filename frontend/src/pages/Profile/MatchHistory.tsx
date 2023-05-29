import { GameData } from "./Profile"



export const MatchHistory = ({history} :{history: GameData[]} ) => {
  if (history.length == 0) {
    return (
      <div className="block3 noMatchYet">
        <span>No match yet! 🤷‍♀️</span>
      </div>
    )
  }

return (
  <div className="block3">
  {
    history.map((match : GameData, i: number) => {
      return (
        <div key={i} className="profile-block">
          <div className="column player1">
            <span>{match.playerOne.name}</span>
          </div>
          <div className="column score1">
            <span>{match.playerOneScore}</span>
          </div>
          <div className="column score2">
            <span>{match.playerTwoScore}</span>
          </div>
          <div className="column player2">
            <span>{match.playerTwo.name}</span>
          </div>
        </div>
      )
    })
  }
  </div>
  )
}
