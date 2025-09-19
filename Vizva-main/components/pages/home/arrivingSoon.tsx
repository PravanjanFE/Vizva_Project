import styled from "@emotion/styled";
import Link from "next/link";
import { Header } from "./liveAuctions";
import { breakpoint } from "public/breakpoint";
import MaxWidth from "components/layout/maxWidth";

export default function ArrivingSoon() {
  return (
    <MaxWidth>
      <>
        <StyledHeader>
          <h2 className="heading">What is Vizva</h2>
        </StyledHeader>
        <StyledDiv>
          <div className="container__video">
            <iframe
              style={{
                width: "100%",
                height: "100%",
              }}
              src="https://www.youtube.com/embed/YAe5R7uuba8?rel=0"
              title="Vizva"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="container__text">
            <p>Amplify the value of your NFT with Vizva.</p>
            <Link href="/about">
              <a>know more</a>
            </Link>
          </div>
        </StyledDiv>
      </>
    </MaxWidth>
  );
}

const StyledHeader = styled(Header)`
  z-index: 1;
  a {
    cursor: pointer;
    svg {
      width: 30px;
      height: 30px;
      max-width: 30px;
      max-height: 30px;
      stroke: ${(props) => props.theme.green} !important;
    }
  }
`;

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 2fr 1fr;
  aspect-ratio: 16/5;

  p {
    text-align: center;
    margin-bottom: 30px;
    font-size: var(--fontsizes-5);
    line-height: 1.5em;
    max-width: 15ch;
  }

  .container__video {
    background-color: ${(props) => props.theme.gray3};
    position: relative;
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
  .container__text {
    background-color: ${(props) => props.theme.onBackground};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px;

    a {
      color: ${(props) => props.theme.green};
      border-bottom: 1px solid ${(props) => props.theme.green};
      transition: 80ms ease;
      font-size: var(--fontsizes-3);

      &:hover {
        padding-bottom: 3px;
        outline: none;
      }
    }
  }

  ${breakpoint("md")} {
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr;
  }
`;
