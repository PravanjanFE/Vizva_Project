import GridHelper from "components/layout/gridHelper";
import ArtistCard, { LoadingArtistCard } from "../../layout/artistCard";
import Link from "next/link";
import { Header, StyledNav } from "./liveAuctions";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { breakpoint } from "public/breakpoint";
import styled from "@emotion/styled";
import RightArrow from "components/icons/right arrow";
import LeftArrow from "components/icons/left arrow";
import { useMoralisCloudFunction } from "react-moralis";
import MaxWidth from "components/layout/maxWidth";
import { User } from "vizva";

export default function TrendingArtists() {
  const {
    data: allUserData,
    error: fetchAllUserError,
    isLoading: fetchAllUserLoading,
  } = useMoralisCloudFunction("getAllUsers");

  return (
    <>
      <MaxWidth>
        <Header>
          <>
            <h2>trending artists</h2>
            <Link href="/discover/artist">
              <a>view all</a>
            </Link>
          </>
        </Header>
      </MaxWidth>
      {/* large screen view */}
      <MaxWidth>
        <StyledLargeScreen>
          {fetchAllUserLoading || fetchAllUserError ? (
            <>
              <GridHelper>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((user, index) => (
                  <LoadingArtistCard isHome={true} key={index} />
                ))}
              </GridHelper>
            </>
          ) : allUserData && (allUserData as any)?.length > 0 ? (
            <GridHelper>
              {JSON.parse(JSON.stringify(allUserData))
                .slice(0, 8)
                .map((user: User) => (
                  <ArtistCard data={user} isHome={true} key={user.username} />
                ))}
            </GridHelper>
          ) : (
            <></>
          )}
        </StyledLargeScreen>
      </MaxWidth>
      {/* mobile view */}
      <StyledDiv
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={20}
        navigation={{
          nextEl: ".artist-next-btn",
          prevEl: ".artist-previous-btn",
        }}
        pagination={{
          el: ".artists-pagination",
          type: "bullets",
          clickable: true,
        }}
        slidesPerView="auto"
        loop={true}
        loopedSlides={7}
        centeredSlides={true}
      >
        {fetchAllUserLoading ? (
          <>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((artist) => (
              <SwiperSlide key={artist}>
                <LoadingArtistCard isHome={true} key={artist} />
              </SwiperSlide>
            ))}
          </>
        ) : allUserData && (allUserData as any)?.length > 0 ? (
          <>
            {JSON.parse(JSON.stringify((allUserData as []).slice(0, 8))).map(
              (user: User) => (
                <SwiperSlide
                  key={user.username}
                  style={{
                    padding: "0 var(--padding-6)",
                  }}
                >
                  <ArtistCard data={user} isHome={true} key={user.username} />
                </SwiperSlide>
              )
            )}
          </>
        ) : (
          <></>
        )}
      </StyledDiv>

      <StyledCustomNav>
        <button className="previous-btn artist-previous-btn">
          <LeftArrow />
        </button>
        <div className="pagination artists-pagination"></div>
        <button className="next-btn artist-next-btn">
          <RightArrow />
        </button>
      </StyledCustomNav>
    </>
  );
}

const StyledLargeScreen = styled.div`
  display: none;

  ${breakpoint("md")} {
    display: block;
  }
`;

const StyledDiv = styled(Swiper)`
  display: block;
  position: relative;

  ${breakpoint("md")} {
    display: none;
  }
`;

const StyledCustomNav = styled(StyledNav)`
  ${breakpoint("md")} {
    display: none;
  }
`;
