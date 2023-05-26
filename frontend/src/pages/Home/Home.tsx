import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

interface HomeProps {
  homeRef: React.RefObject<HTMLDivElement>;
}

export const Home: React.FC<HomeProps> = ({ homeRef }) => {
  const navigate = useNavigate();

  const handleAuth42 = () => {
    let url = `${import.meta.env.VITE_API42_URI}`;
    window.open(url, "_self");
    };

  const handleAuthGoogle = () => {
    navigate("/auth/google");
  };

  async function handle2FA(): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}` + '/auth/2FA/generate', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			//body: JSON.stringify({ twoFACode: twoFACode, token: cookieToken })
		});
		const data = await response.json();
		if (data === true)
		{
      console.log("success");
    }
    return data;
  };
//        <button className="button" onClick={handleAuth42}>Connect with 42</button>

  return (
    <div ref={homeRef} id="Home" className="home">
    <h1>Home</h1>
    <div className="button-group">
        <button className="button" onClick={handle2FA}>2FA</button>
      </div>
  </div>
  );
};
