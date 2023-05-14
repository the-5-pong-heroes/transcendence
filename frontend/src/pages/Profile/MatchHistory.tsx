export const MatchHistory = ({history}) => {
return (
  <div>
  {
    history.map((match) => {
      <div className="profile-block block3">
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
    })
  }
  </div>
  )
}
