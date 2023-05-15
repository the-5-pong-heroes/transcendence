import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICreateUser } from '../../interfaces';
import './Login.css';

interface ILoginProps {
  logRef: React.RefObject<HTMLDivElement>;
}

export const Login: React.FC<ILoginProps> = ({ logRef }) => {
	const	[user, setUser] = useState<ICreateUser>({ email: '', password: '' });
	const	[errMessage, setErrMessage] = useState<string>('');
	const	navigate = useNavigate();

	const	handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const	{ name, value } = event.target;
		setUser(prev => ({ ...prev, [name]: value }));
	}
	
  const	handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrMessage("");
    const config = {
      method: "POST",
      mode: "cors" as RequestMode,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(user)
    };
    const response = await fetch('http://localhost:3000/auth/signin', config);
    const data = await response.json();
    if (!response.ok)
    {
      console.log(response);
      console.log(data);
      setErrMessage(data.message);
      return;
    }
    localStorage.setItem('access_token', `Bearer ${data.access_token}`);
    navigate('/');
    window.location.reload();
}

	return (
		<div ref={logRef} className="Login">
			<form className="form" onSubmit={handleSubmit}>
				<h2>Sign In</h2>
				<input
					className="input"
					type="text"
					name="email"
					value={user.email}
					onChange={handleChange}
					placeholder="Email"
				/>
				<input
					className="input"
					type="password"
					name="password"
					value={user.password}
					onChange={handleChange}
					placeholder="Password"
				/>
				{
					errMessage && 
					<div className="err-message">{errMessage}</div>
				}
				<input
					className="submit"
					type="submit"
					value="Send"
				/>
			</form>
		</div>
	);
}

export default Login;
