import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Mousewheel } from "swiper";

import { handleOnClickButton } from "@/helpers";
import { useAppContext } from "@hooks";
import type { AppContextParameters } from "@types";

import "./Home.css";
import "swiper/css";
import "swiper/css/effect-coverflow";

interface HomeProps {
  homeRef: React.RefObject<HTMLDivElement>;
}

const Technologies: React.FC = () => {
  const technologyList = [
    "React.js",
    "React Three Fiber",
    "Nest.js",
    "PostgreSQL",
    "Prisma Studio",
    "Docker Compose",
    "Socket.io",
  ];

  return (
    <>
      <div className="carroussel-heading">Technologies</div>
      <div className="carroussel-list">
        {technologyList.map((technology) => (
          <span key={technology} className="technology">
            ➮ {technology}
          </span>
        ))}
      </div>
    </>
  );
};

const Credits: React.FC = () => {
  const creditsList = ["mkralik", "pguinie", "lcavallu", "llalba", "efrancon"];

  return (
    <>
      <div className="carroussel-heading">Technologies</div>
      <div className="carroussel-list">
        {creditsList.map((login) => (
          <span key={login} className="technology">
            ⋆ {login}
          </span>
        ))}
      </div>
    </>
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
          <SwiperSlide>The subject</SwiperSlide>
          <SwiperSlide>Game rules</SwiperSlide>
          <SwiperSlide>
            <Technologies />
          </SwiperSlide>
          <SwiperSlide>Credits</SwiperSlide>
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
      {/* <h1>Welcome !</h1> */}
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
