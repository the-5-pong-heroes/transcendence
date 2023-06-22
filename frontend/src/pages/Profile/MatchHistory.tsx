import { Link } from "react-router-dom";

import { type GameData } from "./Profile";
import "./Profile.css";

export const MatchHistory = ({ history }: { history: GameData[] }) => {
  if (!history || history.length == 0) {
    return (
      <div className="noMatchYet">
        <span>No match yet! 🤷‍♀️</span>
      </div>
    );
  }

  return (
    <div>
      {history.map((match: GameData, i: number) => {
        return (
          <div key={i} className="profile-block">
            <div className="column player1">
              <Link to={`/profile/${match.playerOne.id}`} className="link-prof">
                <span>{match.playerOne.name}</span>
              </Link>
            </div>
            <div className="column score1">
              <span>{match.playerOneScore}</span>
            </div>
            <div className="column score2">
              <span>{match.playerTwoScore}</span>
            </div>
            <div className="column player2">
			{match.playerTwo ? 
              <Link to={`/profile/${match.playerTwo.id}`} className="link-prof">
                <span>{match.playerTwo.name}</span>
              </Link>
			  :
              <div className="link-prof">
                <span>bot</span>
              </div>
			  }
            </div>
          </div>
        );
      })}
    </div>
  );
};
