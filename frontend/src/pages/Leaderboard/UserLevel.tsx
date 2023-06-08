import { Plant, Walle, Eve, Energy } from "../../assets";

export const UserLevel = ({ myClassName, level }: { myClassName: string; level: string }) => {
  const LEVELS: string[] = ["plant", "walle", "eve", "energy"];
  const levelPicture = [Plant, Walle, Eve, Energy][LEVELS.indexOf(level)];

  return (
    <div className={myClassName}>
      <img src={levelPicture} alt="levelPicture" />
      <span>{level}</span>
    </div>
  );
};
