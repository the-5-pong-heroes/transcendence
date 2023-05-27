import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

interface HomeProps {
  homeRef: React.RefObject<HTMLDivElement>;
}

export const Home: React.FC<HomeProps> = ({ homeRef }) => {
  const navigate = useNavigate();

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
      console.log(data); // Utilisez les données renvoyées par votre backend selon vos besoins
    } catch (error) {
      console.error(error); // Gérez les erreurs de manière appropriée
    }
  }

  async function handle2FAfunction(): Promise<any> {
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

function openPopup() {
  const popup = document.getElementById("popup");
  if (popup) {
    popup.style.display = "block";
  }
}

function submitVerificationCode() {
  const verificationCodeInput = document.getElementById(
    "verificationCode"
  ) as HTMLInputElement;
  if (verificationCodeInput) {
    const verificationCode = verificationCodeInput.value;

    if (verificationCode === "123456") {
      alert("Code de vérification correct !");
      closePopup();
    } else {
      alert("Code de vérification incorrect. Veuillez réessayer.");
    }
  }
}

function closePopup() {
  const popup = document.getElementById("popup");
  if (popup) {
    popup.style.display = "none";
  }
}

return (
  <div ref={homeRef} id="Home" className="home">
    <h1>Home</h1>
    <div className="button-group">
      <button className="button" onClick={handle2FA}>
        2FA
      </button>
    </div>
    <button onClick={openPopup}>Ouvrir le pop-up</button>
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
