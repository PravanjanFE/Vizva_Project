import Image from "next/image";
import styled from "@emotion/styled";
import CountDown from "./countdown";
import Link from "next/link";
import { breakpoint } from "public/breakpoint";
import ArtistInformation from "./artist";
import nProgress from "nprogress";
import { NFTCardProps } from "vizva";
import React, { useState } from "react";
// this component accets a href prop to favor artworks displayed under bids and it should be used only for those bid artworks

export default function ArtworkCard(props: NFTCardProps) {
  const { data, onClick, className, href } = props;
  const [loaded, setLoaded] = useState(false);
  const {
    title,
    createdBy,
    owner,
    highestBidInETH,
    endTime,
    amountInETH,
    id,
    file,
    currency,
    type,
    format,
    mediaFormat,
  } = data;

  return (
    <>
      <StyledDiv className={className}>
        {endTime && <CountDown time={endTime} />}
        {/* {endTime && <CountDown time={new Date(endTime.iso).getTime()} />} */}
        <div className="content">
          <Link href={href ? href : `/artwork/${id}?type=${type}`}>
            <a
              onClick={() => {
                nProgress.start();
              }}
            >
              <StyledImage className="artwork-card-image-container">
                <div className="faker"></div>
                {mediaFormat === "image" ? (
                  <Image
                    alt={title + " image"}
                    src={file}
                    layout="fill"
                    objectFit="cover"
                    quality={50}
                    sizes="500px"
                    priority
                    objectPosition="center top"
                    className="img-gr"
                  />
                ) : mediaFormat === "video" ? (
                  <>
                    <video
                      autoPlay
                      src={`${file}`}
                      muted
                      loop
                      onLoadedData={() => setLoaded(true)}
                    ></video>
                    {!loaded && <div className="artwork__cover"></div>}
                  </>
                ) : (
                  <div className="artwork__cover"></div>
                )}
              </StyledImage>
            </a>
          </Link>
          <StyledContent className="artwork-card-other-information">
            <p className="artwork-name">{title ?? "No title provided"}</p>
            <hr />
            <StyledFooter>
              <ArtistInformation
                heading={owner ? "Owner" : "Creator"}
                data={{
                  username: owner ? owner.user.username : createdBy?.username,
                  profilePic: owner
                    ? owner.user.profilePic
                    : createdBy?.profilePic,
                }}
                size="52"
              />

              <StyledPrice>
                {/* {highestBidInETH && ( */}
                <>
                  <p className="price__text">
                    {type === "auction" ? "Current Bid" : "Price"}
                  </p>
                  {/* <div> */}
                  <p className="price__amount">
                    {parseFloat(highestBidInETH) > 0
                      ? highestBidInETH
                      : amountInETH}{" "}
                    {currency}
                  </p>
                  {/* </div> */}
                </>
                {/* )} */}
              </StyledPrice>
            </StyledFooter>
          </StyledContent>
        </div>
      </StyledDiv>
    </>
  );
}

export const LoadingArtworkCard = React.memo(function ({
  className,
  auction = false,
}: {
  className?: string;
  auction?: boolean;
}) {
  return (
    <StyledLoadingCard className={className}>
      {auction && <div className="countdown-skeleton"></div>}
      <div className="content">
        <div className="image-skeleton">
          <div className="faker"></div>
        </div>
        <div className="title-skeleton"></div>
        <div className="footer-skeleton">
          <div className="artist-skeleton">
            <div className="rounded-image"></div>
            <div className="skeleton"></div>
          </div>
          <div className="price-skeleton">
            <div className="skeleton"></div>
          </div>
        </div>
      </div>
    </StyledLoadingCard>
  );
});

const StyledLoadingCard = styled.div`
  width: 100%;
  border-radius: 5px;
  overflow: visible;
  position: relative;

  &:hover {
    .image-skeleton {
      transform: rotate(0);
    }
  }

  .countdown-skeleton {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 40px;
    border-radius: 50px;
    background-color: ${(props) => props.theme.gray3};
  }
  .content {
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: grid;
    grid-template-rows: 1fr max-content;
  }

  .image-skeleton {
    width: 100%;
    background-color: ${(props) => props.theme.gray4};
    transform: rotate(2deg);
    z-index: -1;
    border-radius: 12px;
    transition: transform 250ms ease;
  }

  .title-skeleton {
    width: 50%;
    height: 20px;
    border-radius: 20px;
    background-color: ${(props) => props.theme.gray3};
    margin: var(--padding-3) 0;
  }

  .footer-skeleton {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 8px;
    border-top: 1px solid ${(props) => props.theme.gray3};
  }

  .skeleton {
    width: 100%;
    height: 20px;
    background-color: ${(props) => props.theme.gray3};
    border-radius: 20px;
  }

  .artist-skeleton {
    display: grid;
    grid-template-columns: max-content 1fr;
    align-items: center;
    gap: 8px;
  }
  .rounded-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.gray4};
  }

  .price-skeleton {
    display: grid;
    align-items: center;

    & > :nth-of-type(2) {
      background-color: ${(props) => props.theme.gray3};
    }
  }

  .faker {
    margin-top: 100%;
  }
`;

const StyledDiv = styled.div`
  width: 100%;
  position: relative;
  color: ${(props) => props.theme.primary};
  border-radius: 5px;
  display: inline-block;
  overflow: visible;
  .countdown-time {
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .content {
    /* position: absolute; */
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    /* height: 100%; */
    display: grid;
    grid-template-rows: 1fr max-content;
    grid-template-columns: 100%;

    & > a {
      overflow: visible;
      &:hover,
      &:focus {
        .artwork-card-image-container {
          transform: rotate(0);
        }
      }
    }
  }

  &:hover,
  &:focus {
    .artwork-card-image-container {
      transform: rotate(0);
    }
  }

  .faker {
    margin-top: 100%; //110% for rectangular image
  }
`;

const StyledImage = styled.div`
  position: relative;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transform: rotate(1.3deg);
  transition: 100ms transform linear;
  border-radius: 12px;
  cursor: pointer;

  .artwork__cover {
    background: ${(props) => props.theme.gradient};
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    object-position: 50% 50%;
    object-fit: cover;
  }

  video {
    position: absolute;
    /* top: 0;
    bottom:0;
    left:0;
    right:0; */
    height: 100%;
    object-position: 50% 50%;
    object-fit: cover;
  }
`;

const StyledPrice = styled.div`
  display: grid;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  .price__text {
    color: ${(props) => props.theme.gray2};
  }
  .price__amount {
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
  display: grid;
  hr {
    margin: 0.8rem 0;
    opacity: 0.3;
  }

  /* title */
  & > p.artwork-name {
    padding-top: 10px;
    text-transform: capitalize;

    /* display: inline; */
    width: 100%;
    max-width: min-content;

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
