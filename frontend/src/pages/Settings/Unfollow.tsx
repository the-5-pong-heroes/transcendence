import { UserSettings } from "./Settings"

export const Unfollow = ({settings} :{settings: UserSettings} ) => {
  if (!settings.friends || settings.friends.length == 0) {
    return (
      <div className="noMatchYet">
        <span>No friend yet! 🤷‍♀️</span>
      </div>
    )
  }

  function removeFriend() {
    // TODO
  }

return (
  <div className="settings-col">
    {
      settings.friends.map((friend : {name: string, id: string}, i: number) => {
        return (
          <div key={i} className="friends-list" onClick={() => { window.confirm( 'Are you sure you want to remove this friend?', ) && removeFriend() }}>
            <span>{friend.name}</span>
            <span className="cross">✗</span>
          </div>
        )
      })
    }
  </div>
  )
}
