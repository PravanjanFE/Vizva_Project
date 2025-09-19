import styled from "@emotion/styled";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { breakpoint } from "public/breakpoint";
import useMultipleNftDetails from "hooks/useMultipleNftDetails";
import Button from "components/button";
import LeftArrow from "components/icons/left arrow";

export default function HeroSection() {
  const { loading, data, error } = useMultipleNftDetails("getAllOnSaleItems");

  return (
    <StyledHeader>
      <div>
        <Swiper
          modules={[Navigation, A11y, Autoplay]}
          spaceBetween={0}
          loop={true}
          autoplay={{ delay: 5000 }}
          navigation={{
            nextEl: ".hero-next-btn",
            prevEl: ".hero-previous-btn",
          }}
          slidesPerView="auto"
          loopedSlides={7}
          centeredSlides={true}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {(!data || data.length === 0) && (
            <>
              {[0, 1, 2, 3, 4].map((i) => (
                <SwiperSlide key={i} style={{ flexShrink: "1" }}>
                  <Display />
                </SwiperSlide>
              ))}
            </>
          )}
          {data && data.length > 0 && (
            <>
              {data.map((artwork: DisplayProps, index: number) => (
                <SwiperSlide key={index} style={{ flexShrink: "1" }}>
                  <Display {...artwork} href={`/${index}/auction`} />
                </SwiperSlide>
              ))}
            </>
          )}
        </Swiper>
      </div>
      <div className="hero-spacing"></div>
      <div className="navigation">
        <div className="hero-previous-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="33"
            fill="none"
            viewBox="0 0 21 33"
          >
            <path
              stroke="#000"
              strokeMiterlimit="10"
              strokeWidth="2"
              d="M20.03 1L2 16.51l18.03 15.52"
            ></path>
          </svg>
        </div>
        <div className="hero-next-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="33"
            fill="none"
            viewBox="0 0 21 33"
          >
            <path
              stroke="#000"
              strokeMiterlimit="10"
              strokeWidth="2"
              d="M1 1l18.03 15.51L1 32.03"
            ></path>
          </svg>
        </div>
      </div>
    </StyledHeader>
  );
}

interface DisplayProps {
  file?: string;
  title?: string;
  href?: string;
  createdBy?: {
    username: string;
  };
}

function Display(props: DisplayProps) {
  const { file, title, createdBy } = props;
  return (
    <StyledDisplay>
      <div className="image-container">
        {file && <img loading="lazy" src={file} />}
        <div className="faker"></div>
      </div>
      <div className="content">
        {title ? (
          <>
            <p>Wealth and power</p>
            <p>releasing soon,</p>
            <p className="content__title">
              {title} by{" "}
              <span className="content__username">{createdBy?.username}</span>
            </p>
          </>
        ) : (
          <>
            <div className="block-display block-1"></div>
            <div className="block-display"></div>
            <div className="block-display block-2"></div>
          </>
        )}
        {createdBy ? (
          <Button
            variant="outline"
            text="Check the NFT"
            href={`/${createdBy.username}`}
            size="sm"
          />
        ) : (
          <div className="block-btn"></div>
        )}
      </div>
    </StyledDisplay>
  );
}

const StyledHeader = styled.header`
  /* background: red; */
  max-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: var(--padding-5) 0;
  /* height: calc(100vh - 100px); */
  min-height: calc(100vh - 100px - var(--padding-5) - var(--padding-5));
  /* height:100%; */

  .swiper-slide {
    width: 98vw;
    position: relative;
    /* margin-top: 5rem; */
    display: flex;
    &.swiper-slide {
      align-items: center;
    }
    &.swiper-slide-active {
      margin-left: unset;
      align-items: center;
      justify-content: center;
    }
  }

  .hero-spacing {
    height: 3rem;
  }
  .navigation {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 0 auto;
    gap: 5rem;
    svg {
      width: 36px;
      height: 36px;
      display: block;
      path {
        stroke: ${(props) => props.theme.primary};
      }
    }
  }

  ${breakpoint("lg")} {
    /* min-height: calc(
      100vh - 100px - var(--padding-8) - var(--padding-8) - 3rem
    ); */

    padding: var(--padding-8) 0;
  }
  ${breakpoint("3xl")} {
    /* min-height: calc(
      100vh - 100px - var(--padding-10) - var(--padding-10) - 3rem
    ); */

    padding: var(--padding-10) 0;
  }
`;

const StyledDisplay = styled.div`
  display: flex;
  flex-direction: column;
  /* flex-shrink: 1; */

  .image-container {
    width: 80vw;
    border-radius: 11%;
    overflow: hidden;
    background-color: ${(props) => props.theme.gray700};
    position: relative;
    margin: 0 auto;

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .faker {
      margin-top: 80%;
    }
  }

  .content {
    margin-top: 2rem;
    text-align: center;
    .block-display {
      height: 20px;
      width: 90%;
      background-color: ${(props) => props.theme.gray500};
      border-radius: 20px;
      margin: 0 auto;
      &.block-1 {
        margin-bottom: 5px;
        width: 55%;
      }
      &.block-2 {
        margin-top: 10px;
        width: 85%;
      }
    }
    .block-btn {
      margin: 10px auto 0 auto;
      border-radius: 35px;
      height: 70px;
      width: 200px;
      background-color: ${(props) => props.theme.gray500};
    }
    p {
      font-weight: normal;
      text-transform: capitalize;
      font-size: var(--fontsizes-6);
      line-height: 1.3em;

      &:first-of-type {
        font-size: var(--fontsizes-1);
      }
    }

    a {
      margin-top: 10px;
    }
  }

  .content__title {
    display: flex;
    align-items: start;
    justify-content: center;
    flex-direction: column;
  }

  .content__username {
    font-size: inherit;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 13ch;
  }

  ${breakpoint("md")} {
    flex-direction: row;
    .image-container {
      margin: 0 2rem 0 0;
      width: clamp(40vw - 100px, 32rem + 1vw, 70vh - 100px);
    }
    .content {
      align-self: end;
      margin-top: 0;
      text-align: start;
      p {
        font-size: var(--fontsizes-7);
      }

      a {
        margin-top: 20px;
        width: max-content;
        margin-left: auto;
      }
      .block-display {
        height: 30px;
        width: 250px;
        margin: 0;
        &.block-2 {
          margin-top: 5px;
          width: 85%;
        }
      }
      .block-btn {
        margin: 10px 0 0 0;
      }
    }
  }
  ${breakpoint("3xl")} {
    .image-container {
      margin-right: 2rem;
      width: clamp(40vw, 32rem + 1vw, 70vh);
    }
    .content > p {
      font-weight: 300;
      font-size: var(--fontsizes-10);
    }
  }
`;
