import React, { useEffect, useState } from "react";
import "./Login.css";

interface LoginProps {
    click: boolean;
}

const Oauth42 = () => {
    let url = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-1f837ff40c5bf2060ef73b6c1d0ef7ea8d1a9cfcde44e0ac29fff0b2049f91ef&redirect_uri=http%3A%2F%2Flocalhost%3A3333%2Fauth%2Fauth42%2Fcallback&response_type=code`;
    window.open(url, "_self");
};

const OauthGoogle = async () => {
    let url = ``;
    window.open(url, "_self")
};

function Login(props: IProps) {

    if (!props.click) return null;
    return (  
        <div className="button-group">
          onClick={Oauth42}
          <button className="button" onClick={handleAuth42}>Connect with 42</button>
        </div>
    )
}