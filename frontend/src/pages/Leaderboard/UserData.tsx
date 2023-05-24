const UserData = ({ users }: any) => {
  return (
    <>
      {users.map((curUser: any, i: number) => {
        const { avatar, name, score, wins, defeats, level } = curUser;
        return (
          <tr key={i}>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {avatar}
            </td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {name}
            </td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {score}
            </td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {wins}
            </td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {defeats}
            </td>
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {level}
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default UserData;
