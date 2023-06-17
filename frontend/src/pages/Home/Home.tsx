import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Mousewheel } from "swiper";

import { handleOnClickButton } from "@/helpers";
import { useAppContext } from "@hooks";
import type { AppContextParameters } from "@types";
import { WallE_Img, WallE_2_Img, WallE_Eve_2_Img, Eve_Img, WallE_Eve_Img } from "@assets";

import "./Home.css";
import "swiper/css";
import "swiper/css/effect-coverflow";

interface HomeProps {
  homeRef: React.RefObject<HTMLDivElement>;
}

const gameList = [
  { text: "10-point game" },
  { text: "⬆ | ⬇ | Pause | Esc" },
  { text: "If you quit, the game goes on" },
  { text: "Play in mode SOLO or DUO" },
  { text: "May the best man win!" },
];

const techList = [
  { text: "React.js", link: "https://react.dev/" },
  { text: "React Three Fiber", link: "https://github.com/pmndrs/react-three-fiber" },
  { text: "Nest.js", link: "https://nestjs.com/" },
  { text: "PostgreSQL", link: "https://www.postgresql.org/" },
  { text: "Prisma Studio", link: "https://www.prisma.io/" },
  { text: "Docker Compose", link: "https://docs.docker.com/compose/" },
  { text: "Socket.io", link: "https://socket.io/" },
];

const creditsList = [
  { text: "mkralik" },
  { text: "pguinie" },
  { text: "lcavallu" },
  { text: "llalba" },
  { text: "efrancon" },
];

const featuresList = [
  { text: "Play Pong against your friends", link: "/Game" },
  { text: "Chat with your friends", link: "/Chat" },
  { text: "Create public/private/protected channels", link: "/Chat" },
  { text: "Update your user account settings", link: "/Settings" },
];

type ListItem = {
  text: string;
  link?: string;
};

interface SlideProps {
  list?: ListItem[];
  title: string;
  img: string;
  isActive?: boolean;
}

const Slide: React.FC<SlideProps> = ({ list, title, img, isActive }) => {
  return (
    <div className={`carroussel-slide ${isActive ? "active" : ""}`}>
      <img className="carroussel-img" src={img} alt="wall-e" />
      <div className="carroussel-content">
        <div className="carroussel-header">{title}</div>
        <ul className="carroussel-list">
          {list?.map((elem) =>
            elem.link ? (
              <li key={elem.text} className="carroussel-list-elem">
                <Link to={elem.link}>{elem.text}</Link>
              </li>
            ) : (
              <span key={elem.text} className="carroussel-list-elem">
                {elem.text}
              </span>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

const Carroussel: React.FC = () => {
  return (
    <div className="swiper-container">
      <Swiper
        initialSlide={2}
        spaceBetween={20}
        modules={[EffectCoverflow, Mousewheel]}
        mousewheel={true}
        direction="horizontal"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        effect="coverflow"
        rewind={true}
        coverflowEffect={{
          rotate: 0,
          // rotate: 50,
          stretch: 0,
          depth: 400,
          modifier: 1,
          slideShadows: true,
        }}>
        <div className="swiper-wrapper">
          <SwiperSlide>
            {({ isActive }) => <Slide list={techList} title="Technologies" img={WallE_Eve_2_Img} isActive={isActive} />}
          </SwiperSlide>
          <SwiperSlide>
            {({ isActive }) => <Slide list={featuresList} title="Features" img={Eve_Img} isActive={isActive} />}
          </SwiperSlide>
          <SwiperSlide>
            {({ isActive }) => (
              <Slide list={undefined} title="Welcome to Transcendence !" img={WallE_Img} isActive={isActive} />
            )}
          </SwiperSlide>
          <SwiperSlide>
            {({ isActive }) => <Slide list={gameList} title="Game Features" img={WallE_Eve_Img} isActive={isActive} />}
          </SwiperSlide>
          <SwiperSlide>
            {({ isActive }) => <Slide list={creditsList} title="Credits" img={WallE_2_Img} isActive={isActive} />}
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
