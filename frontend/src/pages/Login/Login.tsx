import React from "react";
import { useNavigate } from "react-router-dom";

import { useSignIn } from "./hooks";

import { BASE_URL, API_42 } from "@/constants";
import { Logo_42, Logo_Google, Logo_Eve } from "@assets";
import "./Login.css";

export const Login42: React.FC = () => {
  const handleOnClick = (): void => {
    window.open(API_42, "_self");
  };

  const navigate = useNavigate();
  const twoFACode = React.useState("");
  const [isActivated, setIsActivated] = React.useState(false);

  const handleAuth42 = (): void => {
    window.open(API_42, "_self");
  };

  // const handleAuthGoogle = () => {
  //   navigate("/auth/google");
  // };

  return (
    <div className="Login_with" onClick={handleAuth42}>
      <span>Continue with </span>
      <img id="logo-42" alt="42 Logo" src={Logo_42} />
    </div>
  );
};

export const LoginGoogle: React.FC = () => {
  const handleOnClick = (): void => {
    const url = `${BASE_URL}/auth/google`;
    window.open(url, "_self");
  };

  return (
    <div className="Login_with" onClick={handleOnClick}>
      <span>Continue with</span>
      <img id="logo-Google" alt="Google Logo" src={Logo_Google} />
    </div>
  );
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const signIn = useSignIn();

  const onSignIn: React.FormEventHandler<HTMLFormElement> = (form) => {
    form.preventDefault();
    const formData = new FormData(form.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email === "string" && typeof password === "string") {
      signIn({
        email,
        password,
      });
    }
  };

  return (
    <div className="Login">
      <form className="form" onSubmit={onSignIn}>
        <img id="login-robot" src={Logo_Eve} />
        <input className="input" type="text" name="email" placeholder="Email" required />
        <input className="input" type="password" name="password" placeholder="Password" required />
        <div className="form-sign">
          <input className="submit" type="submit" value="Sign in" />
          <button className="login-link" onClick={() => navigate("/Signup")}>
            Sign up
          </button>
        </div>
        <div className="continue-with">
          <Login42 />
          <LoginGoogle />
        </div>
      </form>
    </div>
  );
};

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Login.css";

// interface LoginProps {
//   logRef: React.RefObject<HTMLDivElement>;
// }

// export const Login: React.FC<LoginProps> = ({ logRef }) => {
//   const navigate = useNavigate();
//   const twoFACode = React.useState('');
//   const [isActivated, setIsActivated] = React.useState(false);

//   const handleAuth42 = () => {
//     window.open(API_42, "_self");
//     };

//   // const handleAuthGoogle = () => {
//   //   navigate("/auth/google");
//   // };

//   const handle2FA = async () => {
//     setIsActivated(prevState => !prevState);
//     try {
//       const data = await handle2FAfunction();
//       console.log(data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   async function handle2FAfunction(): Promise<any> {
//     const response = await fetch(`${BASE_URL}` + '/auth/2FA/generate', {
// 			method: 'POST',
// 			headers: {'Content-Type': 'application/json'},
// 			body: JSON.stringify({ code: twoFACode, twoFAactivated: isActivated })
// 		});
// 		const data = await response.json();
//     console.log("data ===", data);
// 		if (data.twoFAactivated === true)
//       openPopup(data.code);
//     return data;
//   };

//   function openPopup(twoFACode: string) {
//     const popup = document.getElementById("popup");
//     if (popup) {
//       popup.style.display = "block";
//       popup.dataset.twoFACode = twoFACode;
//     }
//   }

//   function submitVerificationCode() {
//     const verificationCodeInput = document.getElementById(
//       "verificationCode"
//     ) as HTMLInputElement;
//     if (verificationCodeInput) {
//       const verificationCode = verificationCodeInput.value;
//       const popup = document.getElementById("popup");
//       if (popup) {
//         const twoFACode = popup.dataset.twoFACode;
//         console.log("twoFA = ",twoFACode);
//         console.log("verif = ",verificationCode);
//         if (verificationCode === twoFACode) {
//           alert("Code de vérification correct !");
//           closePopup();
//         } else {
//           alert("Code de vérification incorrect. Veuillez réessayer.");
//         }
//       }
//     }
//   }

//   function closePopup() {
//     const popup = document.getElementById("popup");
//     if (popup) {
//       popup.style.display = "none";
//       popup.removeAttribute("data-twoFACode");
//     }
//   }

//   return (
//     <div ref={logRef} id="Login" className="Login">
//       <h1>Login</h1>
//       <div className="column column-details">
//       <button className={`walle-button on-off ${isActivated ? 'on' : 'off'}`} onClick={handle2FA}>
//           <div className="handle"></div>
//           <span className="status">{isActivated ? 'ON' : 'OFF'}</span>
//         </button>
//       </div>
//       <div className="column column-details">
//       <button className="walle-button" onClick={handleAuth42}>
//         Connect with 42
//       </button>
//       </div>
//       <div id="popup" style={{ display: "none" }}>
//         <h3>Entrez le code de vérification :</h3>
//         <input type="text" id="verificationCode" style={{ color: "black" }} />
//         <button className="walle-button" onClick={submitVerificationCode}>
//           Valider
//         </button>
//       </div>
//     </div>
//   );
// }
