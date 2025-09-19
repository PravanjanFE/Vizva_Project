import styled from "@emotion/styled";
import Button from "components/button";
import Image from "next/image";
import { breakpoint } from "public/breakpoint";
import InfoBar from "./infoBar";
import { COVER_PIC_HEADER_PROPS } from "./profile.type";

export default function CoverPicHeader(props: COVER_PIC_HEADER_PROPS) {
  const {
    isMyProfile,
    coverPic,
    profilePic,
    ethAddress,
    isFollowing,
    id,
    followUnfollowUser,
    loading,
    profile,
  } = props;

  return (
    <StyledHeader>
      {/* background image */}
      <div className="bg-image">
        <Image
          alt="cover picture"
          src={coverPic ? coverPic : "/images/cover.jpg"}
          layout="fill"
          objectFit="cover"
          unoptimized={false}
          quality={75}
        />
      </div>
      <div className="header">
        {/* profile picture */}
        <div className="profile-picture">
          <div className="image-container">
            {profilePic && (
              <Image
                alt="profile picture"
                src={profilePic}
                layout="fill"
                unoptimized={false}
                quality={75}
                sizes="200px"
                objectFit="cover"
              />
            )}
          </div>
        </div>

        {/* address */}
        <InfoBar
          className="show-lg"
          myProfile={isMyProfile}
          address={ethAddress}
          profile={profile}
        />

        {/* edit or following button */}
        {isMyProfile ? (
          <Button
            text="Edit"
            href="/profile/edit"
            className="action-button action-button--edit hide-sm"
            size="xs"
          />
        ) : (
          <Button
            disabled={isMyProfile || !id}
            loading={loading}
            text={isFollowing ? "Following" : "Follow"}
            className="action-button hide-sm"
            onClick={() => followUnfollowUser(id)}
            size="xs"
          />
        )}
      </div>
    </StyledHeader>
  );
}

export const StyledHeader = styled.header`
  max-height: 15rem;
  min-height: 15rem;
  width: 100%;
  background-color: ${(props) =>
    props.theme.mode === "dark"
      ? "rgba(13, 13, 13, 1)"
      : "rgba(242, 242, 242, 1)"};
  position: relative;
  height: 100%;
  /* & > div {
    height: 100%;
  } */

  .hide-sm {
    display: none;
  }

  .header {
    position: absolute;
    padding: 0 var(--padding-10);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: auto;
    max-width: 1552px;
    margin: 0 auto;
  }

  .bg-image {
    width: 100%;
    height: 15rem;
    background-color: white;
  }

  .info-bar {
    left: calc(150px + var(--padding-10) + var(--padding-7));
  }

  .action-button {
    position: absolute;
    bottom: 10px;
    right: var(--padding-10);
    font-weight: 300;
    letter-spacing: 1px;

    &.action-button--edit {
      background-color: ${(props) => props.theme.onBackground} !important;
      color: ${(props) => props.theme.primary} !important;

      &:hover,
      &:focus {
        color: ${(props) => props.theme.green} !important;
      }
    }
  }
  .profile-picture {
    height: 150px;
    width: 150px;
    position: absolute;
    left: 50%;
    bottom: -75px;

    transform: translate(-50%, 0rem);

    .image-container {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 4px solid ${(props) => props.theme.background};
      background-image: ${(props) => props.theme.gradient};
      overflow: hidden;
      position: relative;
    }
  }

  ${breakpoint("lg")} {
    .hide-sm {
      display: flex;
    }
    .profile-picture {
      left: calc(75px + var(--padding-10));
      /* left:0; */
    }
  }
  ${breakpoint("3xl")} {
    .profile-picture {
      height: 200px;
      width: 200px;
      bottom: -100px;
    }
  }
`;
