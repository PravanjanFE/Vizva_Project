import styled from "@emotion/styled";
import { Dialog } from "@headlessui/react";
import Button from "components/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { breakpoint } from "public/breakpoint";
import { SOCIAL_MEDIA_PROPS } from "./profile.type";

export default function SocialModal({
  isOpen = false,
  active = "followers",
  profile,
  isMyProfile,
  close,
  updateActiveSocial,
  followUser,
  unFollowUser,
  loading,
}: SOCIAL_MEDIA_PROPS) {
  const router = useRouter();
  function clickHandler(path: string) {
    // router.replace(`/${path}`);
    // router.reload();
  }
  {
    /* TODO: following and followers should have the same file structure */
  }
  // const [activeData, setActiveData] = useState<any[]>([]);
  // useEffect(() => {
  //   if (active === "following") {
  //     setActiveData(profile?.followingUsers ?? []);
  //   } else {
  //     setActiveData(profile?.followersUsers ?? []);
  //   }
  // }, [active]);
  return (
    <Dialog open={isOpen} onClose={close}>
      <StyledSocialModal>
        <div className="background" onClick={() => close()}></div>
        {/* <Global styles={{ body: { overflow: "hidden" } }} /> */}
        <div className="container">
          <div className="tab-list">
            <button
              className={active === "following" ? "active" : undefined}
              onClick={() => updateActiveSocial("following")}
            >
              {profile?.followingUsers?.length} Following
            </button>
            <button
              className={active === "followers" ? "active" : undefined}
              onClick={() => updateActiveSocial("followers")}
            >
              {profile?.followersUsers?.length} Followers
            </button>
          </div>
          {/* if active == followers, show followers name, username and profile pic for each profile.followingUsers */}
          {/* {activeData.map((data, index)=>(

          ))} */}
          {active === "followers" && (
            <ul className="users scrollbar">
              {profile.followersUsers?.map((follower, index) => {
                const isFollowingBack = profile.followingUsers?.find(
                  (following) =>
                    following.following.objectId === follower.follower.objectId
                )
                  ? true
                  : false;
                return (
                  <li key={index}>
                    {/* <Link> */}
                    <a
                      href={`${follower.follower.username}`}
                      onClick={() => clickHandler(follower.follower.username)}
                      className="users__user"
                    >
                      <div className="user__information">
                        <div className="user__imageContainer">
                          {follower.follower?.profilePic?.url && (
                            <Image
                              alt="user profile picture"
                              src={follower.follower.profilePic.url}
                              layout="fill"
                              objectFit="cover"
                              quality={75}
                              sizes="96px"
                              className="user-img"
                            />
                          )}
                        </div>
                        <div>
                          <p className="user__name">{follower.follower.name}</p>
                          <p className="user__username">
                            @{follower.follower.username}
                          </p>
                          {/* <Link>
                        <a className="user-name" onClick={() => close()}> */}
                          {/* </a>
                      </Link> */}
                        </div>
                      </div>
                    </a>
                    {/* </Link> */}
                    {isMyProfile && (
                      <Button
                        variant="outline"
                        loading={loading}
                        text={isFollowingBack ? "Unfollow" : "Follow"}
                        size="sm"
                        className="user__actionBtn"
                        onClick={() =>
                          isFollowingBack
                            ? unFollowUser(
                                follower.follower.objectId,
                                follower.follower.username
                              )
                            : followUser(
                                follower.follower.objectId,
                                follower.follower.username
                              )
                        }
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {/* if active == following, show following name, username and profile pic for each profile.followingUsers */}
          {active === "following" && (
            <ul className="users scrollbar">
              {profile.followingUsers?.map((entry, index) => {
                const { following } = entry;
                const isFollowingBack = profile.followersUsers?.find(
                  (follower) =>
                    follower.follower.objectId === following.objectId
                )
                  ? true
                  : false;
                return (
                  <li key={index}>
                    {/* <Link> */}
                    <a
                      href={`/${following.username}`}
                      onClick={() => clickHandler(following.username)}
                      className="users__user"
                    >
                      <div className="user__information">
                        <div className="user__imageContainer">
                          {following?.profilePic?.url && (
                            <Image
                              alt="user profile picture"
                              src={following.profilePic.url}
                              layout="fill"
                              objectFit="cover"
                              quality={75}
                              sizes="96px"
                              className="user-img"
                            />
                          )}
                        </div>
                        <div>
                          <p className="user__name">{following.name}</p>
                          <p className="user__username">
                            @{following.username}
                          </p>
                          {/* <Link>
                        <a className="user-name" onClick={() => close()}> */}
                          {/* </a>
                      </Link> */}
                        </div>
                      </div>
                    </a>
                    {/* </Link> */}
                    {isMyProfile && (
                      <Button
                        variant="outline"
                        loading={loading}
                        text={isFollowingBack ? "Unfollow" : "Follow"}
                        size="sm"
                        className="user__actionBtn"
                        onClick={() =>
                          isFollowingBack
                            ? unFollowUser(
                                following.objectId,
                                following.username
                              )
                            : followUser(following.objectId, following.username)
                        }
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </StyledSocialModal>
    </Dialog>
  );
}

const StyledSocialModal = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  .background {
    background-color: #000000;
    opacity: 0.2;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 12;
  }
  .container,
  .tab-list {
    max-width: 600px;
    width: 90vw;
  }
  .container {
    z-index: 13;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${(props) => props.theme.onBackground};
    height: 100%;
    max-height: 70vh;
    padding: 20px 0 0 0;
    /* padding: 20px 40px; */
    border-radius: 20px;
    overflow: hidden;

    display: grid;
    grid-template-rows: max-content 1fr;
  }

  .tab-list {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 0 10px;
    /* width: 100%; */
    /* background: red; */

    button {
      outline: none;
      border: none;
      /* font-size: var(--fontsizes-1) !important; */
      background: transparent;
      color: ${(props) => props.theme.gray3};
      font-weight: 500;
      border-bottom: 2px solid transparent;
      padding-bottom: var(--padding-5);
      min-width: 150px;
      width: 50%;
      cursor: pointer;
      &.active {
        color: ${(props) => props.theme.primary};
        border-color: ${(props) => props.theme.primary};
      }

      &:hover,
      &:focus {
        color: ${(props) => props.theme.primary};
      }

      ${breakpoint("lg")} {
        font-size: var(--fontsizes-4);
      }
    }
  }

  .users {
    padding: 0 40px;
    margin-top: 1rem;
    list-style-type: none;
    overflow: auto;

    li {
      min-width: 360px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      &:last-of-type {
        padding-bottom: calc(1rem + 20px);
      }
    }
  }
  .users__user {
    width: 100%;
    padding: var(--padding-4) 0 var(--padding-2) 0;
    outline: none;
    text-decoration: none;
    &:hover,
    &:focus {
      .user__username {
        color: ${(props) => props.theme.green};
      }
    }
  }
  .user__information {
    display: flex;
    align-items: center;
    width: 100%;
    &:hover {
      .user__username {
        color: ${(props) => props.theme.green};
      }
    }
  }
  .user__name {
    text-transform: capitalize;
    color: ${(props) => props.theme.primary};
  }
  .user__username {
    color: ${(props) => props.theme.gray3};
  }
  .user__imageContainer {
    width: 52px;
    height: 52px;
    position: relative;
    border-radius: 50%;
    margin-right: 0.4rem;
    background: ${(props) => props.theme.gray4};
    img.user-img {
      border-radius: 50%;
    }
  }
  .user__actionBtn {
    padding: 5px 15px;
    border-width: 1px;
    border-radius: 0px;
    background-color: transparent;

    .loading {
      height: 20px;
      width: 20px;
    }

    &:hover,
    &:focus {
      background-color: ${(props) => props.theme.green};
      color: ${(props) => props.theme.primary};
    }
  }
  ${breakpoint("sm")} {
    .tab-list {
      padding: 0 40px;
      button:first-of-type {
        margin-right: var(--padding-5);
      }
    }
    .users__user {
      padding: var(--padding-4) 0 var(--padding-4) 0;
    }
  }
  ${breakpoint("3xl")} {
    .user__username {
      padding-top: 10px;
    }
  }
`;
