import { useState } from 'react'
import './Toggle2FA.css'

export const Toggle2FA = ({ toggled, onClick }: {toggled: boolean, onClick: (isToggled: boolean) => void}) => {
  const [isToggled, toggle] = useState(toggled);

  const callback = () => {
    toggle(!isToggled);
    onClick(!isToggled);
  }

  return (
    <label className="toggle-btn">
        <input type="checkbox" defaultChecked={isToggled} onClick={callback} />
        <span />
        <strong>2FA</strong>
    </label>
  )
}
