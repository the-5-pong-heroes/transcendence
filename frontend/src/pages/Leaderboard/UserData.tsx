const UserData = ({users}) => {
  return (
    <>
      {
        users.map((curUser : any) => {
          const {avatar, name, score, wins, defeats, level} = curUser;
          return (
            <tr>
              <td>{avatar}</td>
              <td>{name}</td>
              <td>{score}</td>
              <td>{wins}</td>
              <td>{defeats}</td>
              <td>{level}</td>
            </tr>
          )
        })
      }
    </>
  )
}

export default UserData;
