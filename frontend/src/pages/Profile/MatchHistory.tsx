export const MatchHistory = ({history}: any) => {
return (
  <div className="block3">
  {
    history.map((match, i: number) => {
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
