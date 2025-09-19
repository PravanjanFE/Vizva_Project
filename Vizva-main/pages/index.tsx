import styled from "@emotion/styled";
import Navbar from "components/navigation/navbar";
import LiveAuction from "components/pages/home/liveAuctions";
import TrendingArtworks from "components/pages/home/trendingArtwork";
import TrendingArtists from "components/pages/home/trendingArtist";
import Footer from "components/pages/home/footer";
import Sliding from "components/pages/home/Sliding";
import { breakpoint } from "public/breakpoint";
import HomeHeader from "components/pages/home/header";

export default function Home() {
  return (
    <>
      <Navbar active="home" />
      <StyledContainer>
        <StyledDiv>
          <HomeHeader />
          <Sliding />
          <LiveAuction />
          {LiveAuction() && <div className="spacer"></div>}
          <TrendingArtworks />
          {TrendingArtworks() && <div className="spacer"></div>}
          <TrendingArtists />
          <Footer />
        </StyledDiv>
      </StyledContainer>
    </>
  );
}

const StyledContainer = styled.div`
  min-height: 100vh;
  height: 100%;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.primary};
  overflow: hidden;
`;

const StyledDiv = styled.div`
  position: relative;
  overflow: hidden;
  color: ${(props) => props.theme.primary};

  .spacer {
    height: var(--padding-9);
  }
  ${breakpoint("lg")} {
    .spacer {
      height: var(--padding-11);
    }
  }
`;
