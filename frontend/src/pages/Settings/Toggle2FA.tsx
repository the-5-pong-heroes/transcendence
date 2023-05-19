import styled from "styled-components";
import { UserSettings } from "./Settings";
import { useState, ChangeEvent } from "react";



const StyledLabel = styled.label<{ checked: boolean }>`
  cursor: pointer;
  text-indent: -9999wpx;
  width: 250px;
  height: 125px;
  background: ${({ checked }) => (checked ? "#34c759" :  "#adadad")};
  display: block;
  border-radius: 100px;
  position: relative;

  &:after {
  content: "";
  position: absolute;
  left: ${({ checked }) => (checked ? "14px" : "calc(55% - 5px)")};
  top: 12px;
  width: 100px;
  height: 100px;
  background: #fff;
  border-radius: 90px;
  transition: 0.3s;
}`;

export default function Toggle2FA({settings}: {settings: UserSettings}){

  const [switchState, setSwitchState] = useState(true);

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    setSwitchState(!switchState);
  }

  return (
    <StyledLabel htmlFor="checkbox" checked={switchState}>
      <input
        id="checkbox"
        type="checkbox"
        checked={switchState}
        onChange={handleOnChange} />
    </StyledLabel>
  );
}
