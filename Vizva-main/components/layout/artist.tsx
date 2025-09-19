import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import nProgress from "nprogress";
import { breakpoint } from "public/breakpoint";
import { useRef } from "react";

/**
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {string} props.data.username
 * @param {string} props.data.name
 * @param {Object} props.data.profilePic
 * @param {string} [props.size=30px]
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */

interface ArtistProps {
  data: {
    username: string;
    name?: string;
    profilePic?: {
      url: string;
    };
  };
  size?: string | number;
  className?: string;
  heading?: string;
}

export default function ArtistInformation(props: ArtistProps) {
  const { data, size, className, heading = "Creator" } = props;
  const { username, profilePic } = data;

  if (!username) {
    return (
      <StyledDiv className={`${className ? className : undefined} skeleton`}>
        <div
          className="image-circle"
          style={{
            width: `${size ? size + "px" : "30px"}`,
            height: `${size ? size + "px" : "30px"}`,
          }}
        ></div>
        <div className="skeleton"></div>
        <div className="skeleton"></div>
      </StyledDiv>
    );
  }
  return (
    <>
      <StyledDiv className={className ? className : undefined}>
        <div
          className="image-circle"
          style={{
            width: `${size ? size + "px" : "30px"}`,
            height: `${size ? size + "px" : "30px"}`,
          }}
        >
          {profilePic && (
            <Image
              alt="user picture"
              src={profilePic?.url}
              layout="fill"
              objectFit="cover"
              quality={75}
              sizes="300px"
            />
          )}
        </div>
        <p className="artist-heading">{heading}</p>
        <Link href={`/${username}`}>
          <a
            className="artist-name"
            onClick={() => {
              nProgress.start();
            }}
          >
            {username}
          </a>
        </Link>
      </StyledDiv>
    </>
  );
}

const StyledDiv = styled.div`
  color: ${(props) => props.theme.primary};
  display: grid;
  grid-template-areas: "image heading" "image name";
  grid-template-columns: max-content 1fr;
  gap: 8px;

  &.skeleton {
    grid-row-gap: 8px;
  }
  .image-circle {
    align-self: center;
    position: relative;
    grid-area: image;
    border-radius: 50%;
    overflow: hidden;
    background-color: gray;
  }
  .artist-heading {
    grid-area: heading;
    color: ${(props) => props.theme.gray2};
  }
  .artist-name {
    grid-area: name;

    width: 100%;
    max-width: min-content;

    text-transform: capitalize;
    color: inherit;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 10ch;
    &:hover {
      color: ${(props) => props.theme.green};
    }
    align-self: center;
  }
  .skeleton {
    background-color: gray;
  }
  ${breakpoint("md")} {
    grid-row-gap: 2px;
  }
  ${breakpoint("lg")} {
    .artist-name,
    .artist-heading {
      font-size: var(--fontsizes-2);
    }
  }
  ${breakpoint("3xl")} {
    .artist-name,
    .artist-heading {
      font-size: var(--fontsizes-3);
    }
  }
`;
