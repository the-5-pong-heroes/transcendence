import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

interface LoginProps {
  LoginRef: React.RefObject<HTMLDivElement>;
}

export const Login: React.FC<LoginProps> = ({ LoginRef }) => {
  const navigate = useNavigate();
  const twoFACode = React.useState('');
  const isActivated = React.useState(false);

  // const handleAuth42 = () => {
  //   let url = `${import.meta.env.VITE_API42_URI}`;
  //   window.open(url, "_self");
  //   };

  // const handleAuthGoogle = () => {
  //   navigate("/auth/google");
  // };

  const handle2FA = async () => {
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


//        <button className="button" onClick={handleAuth42}>Connect with 42</button>
  return (
    <div ref={LoginRef} id="Login" className="Login">
      <h1>Login</h1>
      <button onClick={handle2FA}>2FA</button>
      <div id="popup" style={{ display: "none" }}>
        <h3>Entrez le code de vérification :</h3>
        <input
          type="text"
          id="verificationCode"
          style={{ color: "black" }}
        />
        <button onClick={submitVerificationCode}>Valider</button>
      </div>
    </div>
  );
}
