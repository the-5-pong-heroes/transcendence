import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Mousewheel } from "swiper";

import { handleOnClickButton } from "@/helpers";
import { useAppContext } from "@hooks";
import type { AppContextParameters } from "@types";
import { WallE_Img, WallE_2_Img, WallE_Pong_Img, WallE_Eve_Img } from "@assets";

import "./Home.css";
import "swiper/css";
import "swiper/css/effect-coverflow";

interface HomeProps {
  homeRef: React.RefObject<HTMLDivElement>;
}

const Technologies: React.FC = () => {
  const list = [
    "React.js",
    "React Three Fiber",
    "Nest.js",
    "PostgreSQL",
    "Prisma Studio",
    "Docker Compose",
    "Socket.io",
  ];

  const imgStyle: React.CSSProperties = {
    backgroundImage: `url(${WallE_2_Img})`,
    backgroundSize: "cover",
    borderRadius: "0.5rem",
  };

  return (
    <div className="carroussel-slide">
      <div className="carroussel-img" style={imgStyle}></div>
      <div className="carroussel-heading">Technologies</div>
      <div className="carroussel-list">
        {list.map((technology) => (
          <span key={technology} className="technology">
            ➮ {technology}
          </span>
        ))}
      </div>
    </div>
  );
};

const Credits: React.FC = () => {
  const list = ["mkralik", "pguinie", "lcavallu", "llalba", "efrancon"];

  const imgStyle: React.CSSProperties = {
    backgroundImage: `url(${WallE_Eve_Img})`,
    backgroundSize: "cover",
    borderRadius: "0.5rem",
  };

  return (
    <div className="carroussel-slide">
      <div className="carroussel-img" style={imgStyle}></div>
      <div className="carroussel-heading">Credits</div>
      <div className="carroussel-list">
        {list.map((login) => (
          <span key={login} className="technology">
            ➮ {login}
          </span>
        ))}
      </div>
    </div>
  );
};

const Subject: React.FC = () => {
  const list = [
    { title: "Play Pong against your friends", link: "/Game" },
    { title: "Chat with your friends", link: "/Chat" },
    { title: "Create public/private/protected channels", link: "/Chat" },
    { title: "Update your user account settings", link: "/Settings" },
  ];

  const imgStyle: React.CSSProperties = {
    backgroundImage: `url(${WallE_Img})`,
    backgroundSize: "cover",
    borderRadius: "0.5rem",
  };

  return (
    <div className="carroussel-slide">
      <div className="carroussel-img" style={imgStyle}></div>
      <div className="carroussel-heading">Transcendence</div>
      <div className="carroussel-heading">Available features</div>
      <ul className="carroussel-list">
        {list.map((feature) => (
          <li key={feature.title} className="technology">
            {/* <Link to={feature.title}>{feature.title}</Link> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

const GameFeatures: React.FC = () => {
  const list = [
    "10-point game",
    "Arrow up / Arrow down / Pause / Echap",
    "If you quit, the game goes on",
    "You can play in mode SOLO ord DUO",
    "May the Best Man Win!",
  ];

  const imgStyle: React.CSSProperties = {
    backgroundImage: `url(${WallE_Pong_Img})`,
    backgroundSize: "cover",
    borderRadius: "0.5rem",
  };

  return (
    <div className="carroussel-slide">
      <div className="carroussel-img" style={imgStyle}></div>
      <div className="carroussel-heading">Game Features</div>
      <div className="carroussel-list">
        {list.map((login) => (
          <span key={login} className="technology">
            ➮ {login}
          </span>
        ))}
      </div>
    </div>
  );
};

const Carroussel: React.FC = () => {
  return (
    <div className="swiper-container">
      <Swiper
        modules={[EffectCoverflow, Mousewheel]}
        mousewheel={true}
        direction="horizontal"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        effect="coverflow"
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}>
        <div className="swiper-wrapper">
          <SwiperSlide>
            <Subject />
          </SwiperSlide>
          <SwiperSlide>
            <GameFeatures />
          </SwiperSlide>
          <SwiperSlide>
            <Technologies />
          </SwiperSlide>
          <SwiperSlide>
            <Credits />
          </SwiperSlide>
        </div>
        <div className="swiper-pagination"></div>
      </Swiper>
    </div>
  );
};

export const Home: React.FC<HomeProps> = ({ homeRef }) => {
  const { gameState, isNavigatingRef }: AppContextParameters = useAppContext();

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    handleOnClickButton({ event, path: "/", menuRef: homeRef, gameState, isNavigatingRef });
  };

  return (
    <div ref={homeRef} id="Home" className="home">
      <Carroussel />
      <div className="home-play-button">
        <Link to={"/Game"} className="game-link" onClick={onClick}>
          <span>Ready to play ?</span>
          <svg width="13px" height="10px" viewBox="0 0 13 10">
            <path d="M1,5 L11,5"></path>
            <polyline points="8 1 12 5 8 9"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
};
