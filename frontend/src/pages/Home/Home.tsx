import React, { useEffect, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Mousewheel } from "swiper";

import { gameList, techList, creditsList, featuresList } from "./List";

import { handleOnClickButton } from "@/helpers";
import { useAppContext, useUser } from "@hooks";
import type { AppContextParameters } from "@types";
import { WallE_Img, WallE_2_Img, WallE_Eve_2_Img, Eve_Img, WallE_Eve_Img } from "@assets";
import { CustomLink } from "@/components";

import "./Home.css";
import "swiper/css";
import "swiper/css/effect-coverflow";

type ListItem = {
  text: string;
  link?: string;
};

interface SlideProps {
  list?: ListItem[];
  title: string;
  img: string;
  isActive?: boolean;
  setGoTo?: Dispatch<SetStateAction<string>>;
}

const Slide: React.FC<SlideProps> = ({ list, title, img, isActive, setGoTo }) => {
  const handleClick = (link: string | undefined): void => {
	if (setGoTo && link) {
	  setGoTo(link);
	}
  }

  return (
    <div className={`carroussel-slide ${isActive ? "active" : ""}`}>
      <img className="carroussel-img" src={img} alt="wall-e" />
      <div className="carroussel-content">
        <div className="carroussel-header">{title}</div>
        <ul className="carroussel-list">
          {list?.map((elem) =>
            elem.link ? (
              <li key={elem.text} className="carroussel-list-link" onClick={() => handleClick(elem.link)} >
                <CustomLink to={elem.link}>{elem.text}</CustomLink>
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

interface CarrousselProps {
  setGoTo: Dispatch<SetStateAction<string>>;
}

const Carroussel: React.FC<CarrousselProps> = ({ setGoTo }) => {
  const user = useUser();
  const userName = user ? user.name : "";

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
            {({ isActive }) => <Slide list={featuresList} title="Features" img={Eve_Img} isActive={isActive} setGoTo={setGoTo} />}
          </SwiperSlide>
          <SwiperSlide>
            {({ isActive }) => (
              <Slide
                list={undefined}
                title={`Hi ${userName}, welcome to Transcendence !`}
                img={WallE_Img}
                isActive={isActive}
              />
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

interface HomeProps {
  homeRef: React.RefObject<HTMLDivElement>;
  setGoTo: Dispatch<SetStateAction<string>>;
}

export const Home: React.FC<HomeProps> = ({ homeRef, setGoTo }) => {
  const { gameState, isNavigatingRef }: AppContextParameters = useAppContext();

  useEffect(() => {
    setGoTo("/")
  }, []);

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    setGoTo("/Game")
    handleOnClickButton({ event, path: "/", menuRef: homeRef, gameState, isNavigatingRef });
  };

  return (
    <div ref={homeRef} id="Home" className="home">
      <Carroussel setGoTo={setGoTo} />
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
