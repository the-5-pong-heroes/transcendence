import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

interface LoginProps {
  logRef: React.RefObject<HTMLDivElement>;
}

export const Login: React.FC<LoginProps> = ({ logRef }) => {
  const navigate = useNavigate();
  const twoFACode = React.useState('');
  const [isActivated, setIsActivated] = React.useState(false);

  const handleAuth42 = () => {
    let url = `${import.meta.env.VITE_API42_URI}`;
    window.open(url, "_self");
    };

  // const handleAuthGoogle = () => {
  //   navigate("/auth/google");
  // };

  const handle2FA = async () => {
    setIsActivated(prevState => !prevState);
    try {
      const data = await handle2FAfunction();
      console.log(data); 
    } catch (error) {
      console.error(error);
    }
  }

  async function handle2FAfunction(): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}` + '/auth/2FA/generate', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ code: twoFACode, twoFAactivated: isActivated })
		});
		const data = await response.json();
    console.log("data ===", data);
		if (data.twoFAactivated === true)
      openPopup(data.code);
    return data;
  };

  function openPopup(twoFACode: string) {
    const popup = document.getElementById("popup");
    if (popup) {
      popup.style.display = "block";
      popup.dataset.twoFACode = twoFACode;
    }
  }

  function submitVerificationCode() {
    const verificationCodeInput = document.getElementById(
      "verificationCode"
    ) as HTMLInputElement;
    if (verificationCodeInput) {
      const verificationCode = verificationCodeInput.value;
      const popup = document.getElementById("popup");
      if (popup) {
        const twoFACode = popup.dataset.twoFACode; 
        console.log("twoFA = ",twoFACode);
        console.log("verif = ",verificationCode);
        if (verificationCode === twoFACode) {
          alert("Code de vérification correct !");
          closePopup();
        } else {
          alert("Code de vérification incorrect. Veuillez réessayer.");
        }
      }
    }
  }

  function closePopup() {
    const popup = document.getElementById("popup");
    if (popup) {
      popup.style.display = "none";
      popup.removeAttribute("data-twoFACode"); 
    }
  }

  return (
    <div ref={logRef} id="Login" className="Login">
      <h1>Login</h1>
      <div className="column column-details">
      <button className={`walle-button on-off ${isActivated ? 'on' : 'off'}`} onClick={handle2FA}>
          <div className="handle"></div>
          <span className="status">{isActivated ? 'ON' : 'OFF'}</span>
        </button>
      </div>
      <div className="column column-details">
      <button className="walle-button" onClick={handleAuth42}>
        Connect with 42
      </button>
      </div>
      <div id="popup" style={{ display: "none" }}>
        <h3>Entrez le code de vérification :</h3>
        <input type="text" id="verificationCode" style={{ color: "black" }} />
        <button className="walle-button" onClick={submitVerificationCode}>
          Valider
        </button>
      </div>
    </div>
  );
}
