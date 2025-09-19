import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import CountDown from "components/layout/countdown";
import ArtistInformation from "components/layout/artist";
import { breakpoint } from "public/breakpoint";
import Link from "next/link";
import Logo from "components/navigation/logo";
import Prompt from "components/prompt";
import MaxWidth from "components/layout/maxWidth";
import { GlassBackground } from "components/navigation/navbar";
import TickIcon from "components/icons/tick";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import processNftDetails from "services/processNft.service";
import { NFT } from "vizva";
import Head from "next/head";

/**
 * first, the creator value is parsed from user from useMoralis, sessionStorgae is queried for
 * "success-created" and the seen state is set to seen to prevent infinite rerenders and the
 * session value is cleared.
 *
 * but if no information is gotten from "success-created", the user is prompted to return to
 * the "/create" page
 */

export default function Success({ nft }: { nft: NFT }) {
  const { user, isAuthenticated, Moralis } = useMoralis();
  const [marketId, setMarketId] = useState("");
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && !seen) {
      const sessionData = sessionStorage.getItem("success-created");
      sessionData && setMarketId(sessionData);
      sessionStorage.removeItem("success-created");
      setSeen(true);
    }
  });
  return (
    <>
      <Head>
        <title>Vizva | Success</title>
      </Head>
      <GlassBackground>
        <MaxWidth>
          <StyledNav>
            <Logo />
            {/* <ProfileDropdown /> */}
          </StyledNav>
        </MaxWidth>
      </GlassBackground>
      <MaxWidth>
        {!marketId ? (
          <Prompt
            text="Create NFT"
            href="/create"
            message="please create an artwork"
            closeable={false}
          />
        ) : !isAuthenticated && !user ? (
          <></>
        ) : marketId != nft.id ? (
          <Prompt
            text="Explore"
            href="/discover/artwork"
            message="please purchase an artwork to view this page"
            closeable={false}
          />
        ) : (
          <StyledDiv>
            <StyledArtwork className="artwork-card">
              {nft?.endTime && <CountDown time={nft?.endTime} />}
              {/* {nft.time && <CountDown time={stringToTime(nft.time)} />} */}
              <div className="content">
                <StyledImage className="artwork-card-image-container">
                  <div className="faker"></div>
                  {nft.mediaFormat === "video" && (
                    <video src={nft.file} autoPlay loop></video>
                  )}
                  {nft.mediaFormat === "image" && (
                    <img src={nft.file} alt={nft.title} />
                  )}
                  {nft.mediaFormat === "audio" && (
                    <audio src={nft.file}></audio>
                  )}
                </StyledImage>
                <StyledContent className="artwork-card-other-information">
                  <p className="artwork-name">
                    {nft.title ?? "No title provided"}
                  </p>
                  <hr />
                  <StyledFooter>
                    <ArtistInformation data={nft.createdBy} size="52" />

                    <StyledPrice className="artwork-information">
                      <div>
                        <p>
                          {nft.type === "auction" ? "Current Bid" : "Price"}
                        </p>
                      </div>
                      <div>
                        <p>{nft.amountInETH} MATIC</p>
                      </div>
                    </StyledPrice>
                  </StyledFooter>
                </StyledContent>
              </div>
            </StyledArtwork>
            <section>
              <div>
                <TickIcon />
              </div>
              <h1>Success!</h1>
              <p>
                Your NFT has been submitted. Please wait with patience till your
                NFT is listed in your profile.
              </p>
              <p>
                You can check the status of your NFT in your
                <Link href={`/${user?.attributes.username}`}>
                  <a>profile</a>
                </Link>
              </p>
            </section>
          </StyledDiv>
        )}
      </MaxWidth>
    </>
  );
}

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--padding-6) 0;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
  padding: var(--padding-7) 0;
  .countdown-time {
    left: 50%;
    transform: translate(-50%, -50%);
  }
  h1 {
    text-transform: capitalize;
    text-align: center;
    margin-bottom: 1.3rem;
    font-size: var(--fontsizes-7);
  }
  section {
    max-width: 500px;
    padding-bottom: 1rem;
    height: max-content;
    margin-top: var(--padding-10);
    /* margin-right:0; */
    & > div {
      margin: 0 auto;
      width: max-content;
      border: 2px solid ${(props) => props.theme.gray3};
      border-radius: 50%;
      width: 100px;
      height: 100px;
      display: grid;
      place-items: center;
    }
    & > :last-child {
      margin-top: 3rem;
    }
    p {
      text-align: center;
      line-height: 1.8em;

      a {
        color: ${(props) => props.theme.green};
        padding-left: 5px;
      }
    }
  }

  @media (min-width: 970px) {
    section {
      margin-top: 0;
      margin-left: var(--padding-10);
    }
  }
`;

const StyledArtwork = styled.div`
  width: clamp(300px, 20rem + 1vw, 40vw);
  position: relative;
  color: ${(props) => props.theme.primary};
  border-radius: 12px;
  display: inline-block;
  overflow: visible;
  .countdown-time {
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &:hover {
    .artwork-card-image-container {
      transform: rotate(0);
    }
  }
  ${breakpoint("3xl")} {
    width: clamp(300px, 25rem + 1vw, 50vw);
  }
`;

const StyledImage = styled.div`
  position: relative;
  background-color: gray;
  height: 100%;
  /* min-height: 300px; */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transform: rotate(1.3deg);
  transition: 100ms transform linear;
  border-radius: 12px;
  cursor: pointer;

  img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-position: 50% 50%;
    object-fit: cover;
  }

  video {
    position: absolute;
    width: 100%;
    height: 100%;

    object-position: 50% 50%;
    object-fit: cover;
  }

  .faker {
    margin-top: 100%; //110% for rectangular image
  }
`;

const StyledPrice = styled.div`
  display: grid;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  div:first-of-type {
  }
  div:first-of-type > p {
    font-size: var(--fontsizes-1);
    color: ${(props) => props.theme.gray2};
  }
  & > :last-of-type {
    color: ${(props) => props.theme.primary};
  }

  ${breakpoint("md")} {
    grid-row-gap: 2px;
  }
  ${breakpoint("lg")} {
    & > p {
      font-size: var(--fontsizes-2);
    }
  }
  ${breakpoint("3xl")} {
    & > p {
      font-size: var(--fontsizes-3);
    }
  }
`;

const StyledContent = styled.div`
  justify-self: center;
  width: 100%;
  margin-top: 0.5em;
  /* height: 100%; */
  hr {
    margin: 0.8rem 0;
    opacity: 0.3;
  }

  /* title */
  & > p {
    padding-top: 10px;
    text-transform: capitalize;
    max-width: 25ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--fontsizes-5);
  }

  ${breakpoint("lg")} {
    & > p {
      /* font-size: var(--fontsizes-4); */
    }
  }
  @media (min-width: 1500px) {
    & > p {
      font-weight: 400;
      /* font-size: var(--fontsizes-7); */
    }
  }
`;
const StyledFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: center;
  column-gap: 8px;

  .heading {
    color: ${(props) => props.theme.secondary};
  }
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await fetch(
    `${process.env.MORALIS_URL}/functions/getSaleNFTinfo?_ApplicationId=${process.env.APP_ID}&Id=${context?.params?.index}`
  );

  const result = await data.json();
  const processed = await processNftDetails(result.result);
  return {
    props: {
      nft: processed,
    },
    // revalidate: 10,
  };
};
