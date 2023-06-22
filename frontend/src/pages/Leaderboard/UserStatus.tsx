export const UserStatus = ({ myClassName, status }: { myClassName: string; status: string }) => {
  if (status === "IN_GAME") {
    status = "PLAYING";
  }

  return (
    <div className={myClassName}>
      <span className={status === "ONLINE" ? "bullet-green" : status === "PLAYING" ? "bullet-orange" : "bullet-red"}>
        {status !== "PLAYING" ? "•" : "◦"}
      </span>
      <span className="status-text">{status}</span>
    </div>
  );
};
