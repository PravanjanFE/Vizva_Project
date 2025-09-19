import styled from "@emotion/styled";
import Button from "components/button";
import MaxWidth from "components/layout/maxWidth";
import Logo from "components/navigation/logo";
import { GlassBackground } from "components/navigation/navbar";
import Prompt from "components/prompt";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { breakpoint } from "public/breakpoint";
import Congratulations from "public/Congratulations.png";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import processNftDetails from "services/processNft.service";
import { NFT } from "vizva";

export default function Success({ nft, price }: { nft: NFT; price: string }) {
  const { user, isAuthenticated, Moralis } = useMoralis();
  const [id, setId] = useState("");
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && !seen) {
      const sessionData = sessionStorage.getItem("artwork-bought");
      sessionData && setId(sessionData);
      sessionStorage.removeItem("artwork-bought");
      setSeen(true);
    }
  });

  // converts from MATIC to WMATIC. recieves MATIC value as input
  function getETH(WETHValue: string) {
    return Moralis.Units.FromWei(WETHValue);
  }
  return (
    <>
      <Head>
        <title>{`Sucessful bid of ${price} on ${nft.title}`}</title>
      </Head>
      <GlassBackground>
        <MaxWidth>
          <StyledNav>
            <Logo />
          </StyledNav>
        </MaxWidth>
      </GlassBackground>
      <MaxWidth>
        {!id ? (
          <Prompt
            text="Explore"
            href="/discover/artwork"
            message="Explore our marketplace"
            closeable={false}
          />
        ) : !isAuthenticated && !user ? (
          <></>
        ) : id != nft.id ? (
          <Prompt
            text="Explore"
            href="/discover/artwork"
            message="please purchase an artwork to view th is page"
            closeable={false}
          />
        ) : (
          <StyledContainer>
            <div className="image-container">
              <div className="media-container">
                {nft?.file && nft.mediaFormat === "image" && (
                  <Image
                    src={nft.file}
                    layout="fill"
                    objectFit="contain"
                    alt={nft.title}
                  />
                )}
                {nft.mediaFormat === "video" && (
                  <video src={nft.file} controls autoPlay={false}></video>
                )}
                {nft.mediaFormat === "audio" && (
                  <audio src={nft.file} controls autoPlay={false}></audio>
                )}
              </div>
            </div>
            <StyledDiv>
              <div className="image-container">
                <Image
                  src={Congratulations}
                  alt="Congratulations"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h1>Congratulations</h1>
              {nft?.type === "auction" ? (
                <p>
                  <b>Your bid of {price} MATIC for</b> <span>{nft?.title}</span>{" "}
                  by{" "}
                  <span>
                    <Link
                      href={`/${
                        nft.owner
                          ? nft.owner.user.username
                          : nft?.createdBy.name
                      }`}
                    >
                      <a className="nft-owner">{nft?.createdBy.name}</a>
                    </Link>
                  </span>{" "}
                  <b>has been succesfully placed.</b>
                </p>
              ) : (
                <p>
                  <b>You have sucessfully bought </b>
                  <span>{nft?.title}</span>
                  <b> for {price} MATIC from </b>
                  <span>
                    <Link
                      href={`/${
                        nft.owner
                          ? nft.owner.user.username
                          : nft?.createdBy.name
                      }`}
                    >
                      <a className="nft-owner">
                        {nft.owner
                          ? nft.owner.user.username
                          : nft?.createdBy.name}
                      </a>
                    </Link>
                  </span>
                </p>
              )}

              <p>
                {nft?.type === "auction"
                  ? "You can check the status of auction in "
                  : "you can check your NFT in your "}
                {nft?.type === "auction" ? (
                  <Link href="/bids">
                    <a>bids</a>
                  </Link>
                ) : (
                  <Link href={`/${user?.attributes.username}`}>
                    <a>profile</a>
                  </Link>
                )}
              </p>
              <Button text="Explore" href="/discover/artwork" />
            </StyledDiv>
          </StyledContainer>
        )}
      </MaxWidth>
    </>
  );
}

const StyledDiv = styled.div`
  align-self: center;
  text-align: center;
  padding: var(--padding-4) 0;
  height: 100%;
  overflow: hidden;
  h1 {
    font-size: var(--fontsizes-7);
    padding-bottom: var(--padding-5);
  }
  .nft-owner {
    color: inherit;
    &:focus,
    &:hover {
      color: ${(props) => props.theme.green};
    }
  }
  p {
    max-width: 40ch;
    margin: 0 auto;
    padding-bottom: var(--padding-8);

    span {
      text-transform: capitalize;
    }
    /* &:first-of-type {
    } */
    a {
      color: ${(props) => props.theme.green};
    }
  }
  & > .image-container {
    position: relative;
    width: 100%;
    height: 300px;
  }
`;
const StyledContainer = styled.div`
  line-height: calc(1.5 * 1rem);
  min-height: calc(100vh - 100px);
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
  position: relative;
  & > .image-container {
    min-height: 15rem;
    position: sticky;
    padding: 20px;
    background-color: ${(props) => props.theme.onBackground};
    display: flex;
    align-items: center;
    justify-content: center;
    video,
    audio {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    & > .seen {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: absolute;
      right: 1rem;
      top: 1rem;
      border-radius: 20px;
      padding: 8px;
      z-index: 1;
      background-color: #8080804b;
      span {
        color: white;
        mix-blend-mode: initial;
      }
    }
  }
  .media-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  ${breakpoint("lg")} {
    grid-template-columns: 1fr 1fr;

    & > .image-container {
      max-height: calc(100vh - 100px);
      position: sticky;
      top: 100px;
    }
  }
`;
const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--padding-6) 0;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await fetch(
    `${process.env.MORALIS_URL}/functions/getSaleNFTinfo?_ApplicationId=${process.env.APP_ID}&Id=${context?.params?.index}`
  );

  const result = await data.json();
  const processed =
    Object.keys(result.result).length > 0
      ? await processNftDetails(result.result)
      : {};
  return {
    props: {
      nft: processed,
      price: context?.query?.price,
    },
    // revalidate: 10,
  };
};
