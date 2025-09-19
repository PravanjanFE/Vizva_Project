import styled from "@emotion/styled";
import Button from "components/button";
import Image from "next/image";
import Link from "next/link";
import nProgress from "nprogress";
import { useState } from "react";
import { useMoralis } from "react-moralis";
import { useAppDispatch } from "redux/hook";
import { addNotification } from "redux/slice/notificationSlice";
import { UserCardProps } from "vizva";

export default function ArtistCard(props: UserCardProps) {
  const { data, isHome = false, isCollaborations = false } = props;
  const { name, username, coverPic, profilePic, nftCreated, objectId } = data;
  const [liked, setLiked] = useState(() => data.isLiked);
  const [isFollowing, setIsFollowing] = useState(() => data.isFollowing);
  const { user, isAuthenticated, Moralis, isInitialized } = useMoralis();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // create function to call moralis cloud function to like artist
  async function likeUnlikeArtist() {
    if (isAuthenticated) {
      if (liked) {
        const result = await Moralis.Cloud.run("userUnlike", {
          likeClass: "User",
          likeObjectId: objectId,
        });
        setLiked(result);
      } else {
        const result = await Moralis.Cloud.run("userLike", {
          likeClass: "User",
          likeObjectId: objectId,
        });
        setLiked(result);
      }
    } else {
      dispatch(
        addNotification({
          type: "error",
          message: "You must be logged in to like.",
        })
      );
    }
  }

  // Function to follow/unfollow user
  async function followUnfollowUser() {
    setIsLoading(true);
    if (isInitialized && isAuthenticated) {
      if (isFollowing) {
        const result = await Moralis.Cloud.run("unfollowUser", {
          followingId: objectId,
        });
        if (result.toLowerCase() === "unfollowed") {
          setIsFollowing(false);
        }
      } else {
        const result = await Moralis.Cloud.run("followUser", {
          followingId: objectId,
        });
        if (
          result.toLowerCase() === "followed" ||
          result.toLowerCase() === "already following"
        ) {
          setIsFollowing(true);
        }
      }
    } else {
      dispatch(
        addNotification({
          type: "error",
          message: "You need to log in to follow users",
        })
      );
    }
    setIsLoading(false);
  }

  return (
    <StyledArtist $isArtistPage={!isHome && !isCollaborations}>
      {/* <button
        className="seen"
        onClick={() => {
          likeUnlikeArtist();
        }}
      >
        <svg
          className={liked ? "liked" : undefined}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="#ffffff"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      </button> */}
      <Link href={`/${username}`}>
        <a
          onClick={() => {
            nProgress.start();
          }}
        >
          {/* background image */}
          <StyledHeader>
            <div className="background-img">
              <Image
                alt="user cover image"
                src={coverPic?.url ?? "/images/cover.jpg"}
                layout="fill"
                objectFit="cover"
                quality={75}
                sizes="300px"
                priority
              />
            </div>

            {/* profile image */}
            <div className="profile-img">
              <div>
                {profilePic?.url && (
                  <Image
                    alt="user profile picture"
                    src={profilePic?.url}
                    layout="fill"
                    objectFit="cover"
                    quality={75}
                    sizes="200px"
                    priority
                  />
                )}
              </div>
            </div>
          </StyledHeader>
          <main>
            {/* other details */}
            <p className="name">
              <strong>{name || "Vizva User"}</strong>
            </p>

            {/* what shows on artists page */}
            {/* {!isHome && !isCollaborations && (
              <>
                <p className="username">@{username}</p>
              </>
            )} */}
            <div className="items">
              <p>created</p>
              <p className="created-quanitity">{nftCreated}</p>
            </div>
          </main>
        </a>
      </Link>
      {/* what shows on artists page */}
      {!isHome && !isCollaborations && (
        <>
          <StyledBottomBottons>
            <Button
              text={isFollowing ? "Following" : "Follow"}
              size="sm"
              variant="outline"
              disabled={user?.get("username") === username || !isAuthenticated}
              onClick={() => followUnfollowUser()}
              loading={isLoading}
            />
          </StyledBottomBottons>
        </>
      )}
    </StyledArtist>
  );
}

export function LoadingArtistCard({
  isHome = false,
  isCollaborations = false,
}: {
  isHome?: boolean;
  isCollaborations?: boolean;
}) {
  return (
    <StyledArtist $isArtistPage={!isHome && !isCollaborations}>
      {/* background image */}
      <StyledLoadingHeader>
        <div className="background-img"></div>

        {/* profile image */}
        <div className="profile-img">
          <div></div>
        </div>
      </StyledLoadingHeader>

      {/* other details */}
      <div className="skeleton"></div>

      {/* what shows on artists page */}
      <>
        <p className="skeleton-username"></p>
        <div className="items skeleton-items">
          <div></div>
          <p className="skeleton-created-quanitity"></p>
        </div>
      </>

      <button className="seen">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="#ffffff"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <StyledBottomBottons>
        <button className="skeleton-btn"></button>
      </StyledBottomBottons>
    </StyledArtist>
  );
}

const StyledArtist = styled.div<{ $isArtistPage: boolean }>`
  line-height: calc(1.5 * 1rem);
  color: ${(props) => props.theme.primary};
  background-color: ${(props) => props.theme.onBackground};
  border-radius: 1rem;
  overflow: hidden;
  height: auto;
  /* box-shadow: ${(props) =>
    props.theme.mode === "light"
      ? "0px 0px 10px 1px rgba(209, 209, 209, 0.1)"
      : "none"}; */

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  position: relative;
  /* width: 270px; */
  width: 100%;
  flex-grow: 100%;

  main {
    padding: 20px;
  }

  & > button.seen {
    outline: none;
    border: none;
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
    background-color: #f0f0f0;
    cursor: pointer;

    svg {
      width: 20px;
      height: 20px;
      fill: ${(props) => props.theme.gray3};

      &.liked {
        fill: red;
      }
    }

    /* &:focus,
    &:hover {
      transform: scale(1.3);
    } */
  }

  a {
    width: 100%;
    color: initial;
    outline: none;

    &:hover,
    &:focus {
      p.name {
        color: ${(props) => props.theme.green};
      }
    }
  }

  p {
    font-size: var(--fontsizes-4);
    line-height: 1em;
    text-align: center;
  }

  p.name {
    font-size: var(--fontsizes-3);
    line-height: 1.2em;
    text-transform: capitalize;
    text-align: center;
    color: ${(props) => props.theme.primary};
    letter-spacing: 2px;

    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  p.username {
    color: ${(props) => props.theme.secondary};
    /* line-height: calc(1.5 * 1rem); */
    font-size: 90%;
    margin: 0 auto 0.5rem auto;
    padding-top: 1em;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .items {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 0.7em;
    p {
      color: ${(props) => props.theme.gray2};
    }
    ${(props) => {
      if (props.$isArtistPage) {
        return {
          flexDirection: "column",
          "p:last-of-type": {
            paddingTop: "1rem",
          },
        };
      } else {
        return {
          flexDirection: "row-reverse",
          "p:first-of-type": {
            paddingLeft: "1rem",
          },
        };
      }
    }}
  }

  /* skeleton styles */
  p.skeleton-username {
    width: 80%;
    height: 20px;
    background-color: ${(props) => props.theme.gray3};
  }
  .skeleton-items {
    width: 100%;
    padding-top: 10px;
    div {
      width: 50%;
      margin: 0 auto;
      height: 20px;
      background-color: ${(props) => props.theme.gray3};
    }
    p {
      width: 30%;
      margin: 0 auto;
      height: 20px;
      margin-top: 10px;
      background-color: ${(props) => props.theme.gray4};
    }
  }

  &:hover,
  &:focus {
    background-color: ${(props) =>
      props.theme.mode === "dark" ? "rgba(0,0,0,0.5)" : ""};

    box-shadow: ${(props) =>
      props.theme.mode === "light"
        ? "0px 0px 10px 1px rgba(192, 192, 192, 0.3)"
        : "none"};
  }
`;
const StyledHeader = styled.div`
  width: 100%;
  position: relative;
  height: 140px;
  margin-bottom: 40px;

  .background-img {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: white;
  }

  .profile-img {
    & > div {
      height: 70px;
      width: 70px;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      background-color: ${(props) => props.theme.gray400};
    }
    display: grid;
    place-items: center;
    position: absolute;
    height: 80px;
    width: 80px;
    background-color: ${(props) => props.theme.background};
    border-radius: 50%;
    left: 50%;
    bottom: 0px;
    transform: translate(-50%, 50%);
    overflow: hidden;
  }
`;
const StyledLoadingHeader = styled(StyledHeader)`
  .background-img {
    background-color: ${(props) => props.theme.gray500};
  }
`;
const StyledBottomBottons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;

  button {
    width: 70%;
  }

  .skeleton-btn {
    width: 50%;
    height: 30px;
    outline: none;
    border: none;
    border-radius: 5px;
  }
`;
