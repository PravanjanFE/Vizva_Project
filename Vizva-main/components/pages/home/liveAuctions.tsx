import styled from "@emotion/styled";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { A11y, Navigation, Pagination } from "swiper";
import ArtworkCard from "components/layout/artworkCard";
import { breakpoint } from "public/breakpoint";
import LeftArrow from "components/icons/left arrow";
import RightArrow from "components/icons/right arrow";
import useMultipleNftDetails from "hooks/useMultipleNftDetails";
import { LoadingArtworkCard } from "components/layout/artworkCard";
import React from "react";
import MaxWidth from "components/layout/maxWidth";
import { blink } from "entities/keyframes";
import { swiperOptions } from "config/swiper";

export default function LiveAuction() {
  const { loading, data, error } = useMultipleNftDetails(
    "getAllOnAuctionItems"
  );

  if (loading || data.length > 0)
    return (
      <MaxWidth>
        <>
          <Header>
            <>
              <div>
                <h2>live auctions</h2>
                <div className="blink"></div>
              </div>
              <Link href="/discover/artwork?category=live auction">
                <a>view all</a>
              </Link>
            </>
          </Header>
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            navigation={{
              nextEl: ".auction-next-btn",
              prevEl: ".auction-previous-btn",
            }}
            pagination={{
              el: ".auction-pagination",
              type: "bullets",
              clickable: true,
            }}
            {...swiperOptions}
          >
            {data && data.length > 0 ? (
              <>
                <div style={{ height: "50px" }}></div>
                {data.slice(0, 8).map((artwork, index) => (
                  <SwiperSlide
                    key={index}
                    style={{
                      paddingTop: "25px",
                    }}
                  >
                    <ArtworkCard data={artwork} />
                  </SwiperSlide>
                ))}
              </>
            ) : (
              <>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((artwork) => (
                  <SwiperSlide key={artwork}>
                    <div style={{ height: "20px" }}></div>
                    <LoadingArtworkCard auction={true} />
                  </SwiperSlide>
                ))}
              </>
            )}
          </Swiper>
          <StyledNav>
            <button className="auction-previous-btn">
              <LeftArrow />
            </button>
            <div className="pagination auction-pagination"></div>
            <button className="auction-next-btn">
              <RightArrow />
            </button>
          </StyledNav>
        </>
      </MaxWidth>
    );

  return null;
}

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function Header(props: HeaderProps) {
  const { children, className } = props;
  return (
    <StyledHeader className={className ? className : ""}>
      {children}
    </StyledHeader>
  );
}

export const StyledHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: center;
  margin: 0 0 1.5rem;
  grid-gap: 3rem;
  /* padding-bottom: var(--fontsizes-7); */

  & > div:first-of-type {
    display: flex;
    align-items: center;
  }

  div {
    display: flex;
    h2 {
      @media (max-width: 363px) {
        width: min-content;
      }
    }
  }

  h2 {
    text-transform: capitalize;
    line-height: 1.3em;
    font-weight: 400;
    font-size: var(--fontsizes-5);
  }

  a {
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.gray2};
    font-size: var(--fontsizes-2);
    text-transform: capitalize;
    svg {
      margin-left: 1rem;
      color: none;
      stroke: ${(props) => props.theme.green};
    }

    &:hover,
    &:focus {
      color: ${(props) => props.theme.green};
    }
  }

  .blink {
    margin-left: var(--padding-2);
    background-color: ${(props) => props.theme.green};
    width: 12px;
    height: 12px;
    max-width: 12px;
    max-height: 12px;
    border-radius: 50%;
    animation: ${blink} 300ms ease infinite;
  }

  ${breakpoint("lg")} {
    h2 {
      font-size: var(--fontsizes-7);
    }
    a {
      font-size: var(--fontsizes-4);
    }
  }
`;

export const StyledNav = styled.div`
  max-width: calc(100vw - 48px);
  width: max-content;
  margin: var(--padding-7) auto 1rem;
  display: grid;
  grid-template-columns: max-content max-content max-content;
  place-items: center;
  gap: var(--padding-1);

  button {
    outline: none;
    background: transparent;
    border: none;
    width: 40px;
    height: 40px;
    cursor: pointer;
    svg {
      stroke: ${(props) => props.theme.secondary};
      width: 40px;
      max-width: 40px;
      height: 40px;
      max-height: 40px;
    }
    &:hover,
    &:focus {
      svg {
        stroke: ${(props) => props.theme.green};
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .swiper-pagination-bullet {
      width: 15px;
      border-radius: 10px;
      height: 3px;
      background-color: gray;
    }
    .swiper-pagination-bullet-active {
      width: 25px;
    }
  }

  ${breakpoint("md")} {
    max-width: 500px;

    svg {
      width: 40px;
      height: 40px;
    }

    .pagination {
      .swiper-pagination-bullet {
        width: 30px;
      }
      .swiper-pagination-bullet-active {
        width: 50px;
      }
    }
  }

  ${breakpoint("lg")} {
    gap: var(--padding-3);

    margin: var(--padding-9) auto 1rem;
  }
`;
