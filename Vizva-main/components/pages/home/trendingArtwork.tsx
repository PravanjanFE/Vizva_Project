import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import ArtworkCard from "components/layout/artworkCard";
import { breakpoint } from "public/breakpoint";
import { Header, StyledNav } from "./liveAuctions";
import styled from "@emotion/styled";
import LeftArrow from "components/icons/left arrow";
import RightArrow from "components/icons/right arrow";
import useMultipleNftDetails from "hooks/useMultipleNftDetails";
import { LoadingArtworkCard } from "components/layout/artworkCard";
import MaxWidth from "components/layout/maxWidth";
import { swiperOptions } from "config/swiper";

export default function TrendingArtworks() {
  const { loading, data, error } = useMultipleNftDetails("getAllOnSaleItems");

  if (loading || data.length > 0)
    return (
      <MaxWidth>
        <StyledWrapper>
          <Header>
            <h2>trending artworks</h2>
            <Link href="/discover/artwork?category=instant sale">
              <a>view all</a>
            </Link>
          </Header>

          <StyledDiv>
            <Swiper
              modules={[Navigation, Pagination, A11y]}
              navigation={{
                nextEl: ".artwork-next-btn",
                prevEl: ".artwork-previous-btn",
              }}
              pagination={{
                el: ".artwork-pagination",
                type: "bullets",
                clickable: true,
              }}
              {...swiperOptions}
            >
              {data && data.length > 0 ? (
                <>
                  {data.slice(0, 8).map((artwork, index) => (
                    <SwiperSlide key={index}>
                      <div style={{ height: "20px" }}></div>
                      <ArtworkCard data={artwork} />
                    </SwiperSlide>
                  ))}
                </>
              ) : (
                <>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((artwork) => (
                    <SwiperSlide key={artwork}>
                      <div style={{ height: "20px" }}></div>
                      <LoadingArtworkCard />
                    </SwiperSlide>
                  ))}
                </>
              )}
            </Swiper>
          </StyledDiv>

          <StyledNav>
            <button className="artwork-previous-btn">
              <LeftArrow />
            </button>
            <div className="pagination artwork-pagination"></div>
            <button className="artwork-next-btn">
              <RightArrow />
            </button>
          </StyledNav>
        </StyledWrapper>
      </MaxWidth>
    );

  return null;
}
const StyledWrapper = styled.div`
  position: relative;
  isolation: isolate;
  &::after {
    content: "";
    position: absolute;
    width: 350px;
    height: 350px;
    border-radius: 100%;
    top: -75px;
    left: -175px;
    border: 1px solid ${(props) => props.theme.gray3};
    z-index: -1;
  }

  ${breakpoint("lg")} {
    &::after {
      width: 450px;
      height: 450px;
      top: -155px;
      left: -225px;
    }
  }
`;
const StyledDiv = styled.div`
  .artwork-carousel-container {
    display: flex;
    position: relative;
    top: 0;
    left: 0;
  }
`;
