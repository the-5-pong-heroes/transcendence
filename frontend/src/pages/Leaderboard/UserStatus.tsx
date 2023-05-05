export const UserStatus = ({ myClassName, status }) => {

  if (status === "IN_GAME")
    status = "PLAYING";

  return (
    <div className={myClassName}>
      <span className={ status === 'ONLINE' ? "bullet-green" : (status === "PLAYING" ? 'bullet-orange' : 'bullet-red' ) }>
        { status !== "PLAYING" ? "•" : "◦" }
      </span>
      <span>{status}</span>
    </div>
    );
};
