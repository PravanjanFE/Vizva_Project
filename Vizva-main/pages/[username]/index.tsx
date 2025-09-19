import ArtworkCard from "components/layout/artworkCard";
import React, { useEffect, useState } from "react";
import Navbar from "components/navigation/navbar";
import styled from "@emotion/styled";
import { breakpoint } from "public/breakpoint";
import Footer from "components/pages/home/footer";
import useMultipleNftDetails, { parseNFTs } from "hooks/useMultipleNftDetails";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import GridHelper from "components/layout/gridHelper";
import { LoadingArtworkCard } from "components/layout/artworkCard";
import { GetServerSideProps } from "next";
import NoData from "components/layout/noNft";
import Head from "next/head";
import MaxWidth from "components/layout/maxWidth";
import CategoryFilter from "components/pages/profile/categoryFilter";
import TypeFilter from "components/pages/profile/typeFilter";
import SocialModal from "components/pages/profile/socialModal";
import CoverPicHeader from "components/pages/profile/coverPicHeader";
import ProfileDetails from "components/pages/profile/profileDetails";
import { useAppDispatch } from "redux/hook";
import { addNotification } from "redux/slice/notificationSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import processNftDetails from "services/processNft.service";
import LoadingAnimation from "components/animations/Loading";
import nProgress from "nprogress";
import { NFT, User, USER_SOCIAL_FOLLOWING } from "vizva";
import {
  CATEGORIES,
  CATEGORIES_TYPE,
  FILTERS,
  FILTERS_TYPE,
} from "components/pages/profile/profile.type";
import { useRouter } from "next/router";

const defaultProfile = {
  bio: "",
  coverPic: { __type: "", name: "", url: "" },
  createdAt: "",
  ethAddress: "",
  followers: 0,
  following: 0,
  followingUsers: [],
  followersUsers: [],
  instagram: "",
  isFollowing: false,
  isLiked: false,
  name: "",
  nftCreated: 0,
  nftOwned: 0,
  nftWishlisted: 0,
  nftSold: 0,
  objectId: "",
  profilePic: {
    __type: "",
    name: "",
    url: "",
  },
  twitter: "",
  username: "",
  verified: false,
};

export default function Profile({
  // profile: p,
  username,
}: {
  // profile: User;
  username: string;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [activeSocial, setActiveSocial] = useState<"following" | "followers">(
    "followers"
  );
  const [profile, setProfile] = useState<User>(defaultProfile);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [filter, setFilter] = useState(FILTERS[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const { user, isAuthenticated, Moralis, isInitialized } = useMoralis();
  const [createdNftData, setCreatedNftData] = useState<NFT[]>([]);
  const [collectedNftData, setCollectedNftData] = useState<NFT[]>([]);
  const [wishlistNftData, setWishlistNftData] = useState<NFT[]>([]);
  const [hasMoreCreatedNftData, setHasMoreCreatedNftData] = useState(true);
  const [hasMoreCollectedNftData, setHasMoreCollectedNftData] = useState(true);
  const [hasMoreWishlistNftData, setHasMoreWishlistNftData] = useState(true);

  function openSocialModal() {
    setIsSocialModalOpen(true);
  }

  function updateActiveSocial(value: "following" | "followers") {
    setActiveSocial(value);
  }

  const {
    data,
    isFetching,
    error: profileError,
  } = useMoralisCloudFunction("getUserInfoWithUsername", { username });

  useEffect(() => {
    nProgress.done();
  }, []);

  // useEffect(() => {
  //   setIsSocialModalOpen(false);
  //   setActiveSocial("followers");
  //   setProfile(defaultProfile);
  //   setIsMyProfile(false);
  //   setIsFollowing(false);
  //   setFilter(FILTERS[0]);
  //   setCategory(CATEGORIES[0]);
  //   setCreatedNftData([]);
  //   setCollectedNftData([]);
  //   setWishlistNftData([]);
  //   setHasMoreCreatedNftData(true);
  //   setHasMoreCollectedNftData(true);
  //   setHasMoreWishlistNftData(true);
  // }, [router.query.username]);

  useEffect(() => {
    nProgress.done();
  }, [profile]);

  useEffect(() => {
    if (data) {
      let parsed = JSON.parse(JSON.stringify(data));
      const { ACL, sessionToken, accounts, authData, ...others } = parsed;
      setProfile(others);
    }
  }, [data]);

  // fetches created nfts
  const {
    data: createdNft,
    error: createdNftError,
    loading: createdNftLoading,
    fetch: fetchCreatedNfts,
  } = useMultipleNftDetails(
    "getUserCreatedItemsWithUsername",
    {
      username: username,
      skip: 0,
      filter,
    },
    { autoFetch: false }
  );
  // fetches collected nfts
  const {
    data: collectedNft,
    error: collectedNftError,
    loading: collectedNftLoading,
    fetch: fetchCollectedNfts,
  } = useMultipleNftDetails(
    "getUserOwnedItemsWithUsername",
    {
      username: username,
      skip: 0,
      filter,
    },
    { autoFetch: false }
  );
  // fetches wishlist nfts
  const {
    data: wishlistNft,
    error: wishlistNftError,
    loading: wishlistNftLoading,
    fetch: fetchWishlistNfts,
  } = useMultipleNftDetails(
    "getWishlistItemsWithUsername",
    {
      username: username,
      skip: 0,
      filter,
    },
    { autoFetch: false }
  );

  useEffect(() => {
    if (!filter || !category || !isInitialized) return;
    if (category === "created") {
      setCollectedNftData([]);
      setWishlistNftData([]);
      setHasMoreCreatedNftData(true);
      getMoreCreatedNftsWrapper({ unset: true });
    } else if (category === "collected") {
      setCreatedNftData([]);
      setWishlistNftData([]);
      setHasMoreCollectedNftData(true);
      getMoreCollectedNftsWrapper({ unset: true });
    } else if (category === "wishlist") {
      setCreatedNftData([]);
      setCollectedNftData([]);
      setHasMoreWishlistNftData(true);
      getMoreWishlistNftsWrapper({ unset: true });
    }
  }, [filter, category, isInitialized, username]);

  // fetches more nfts

  async function getMoreCreatedNftsWrapper({
    unset = false,
  }: {
    unset?: boolean;
  }) {
    const res = await fetchCreatedNfts({
      params: {
        username: username,
        skip: unset ? 0 : createdNftData.length ?? 0,
        filter,
      },
    });
    const result = Array.isArray(res) ? await parseNFTs(res) : [];
    unset
      ? setCreatedNftData([...result])
      : setCreatedNftData((state) => [...state, ...result]);
    return result;
  }
  async function getMoreCollectedNftsWrapper({
    unset = false,
  }: {
    unset?: boolean;
  }) {
    const res = await fetchCollectedNfts({
      params: {
        username: username,
        skip: unset ? 0 : collectedNftData.length ?? 0,
        filter,
      },
    });
    const result = Array.isArray(res) ? await parseNFTs(res) : [];
    unset
      ? setCollectedNftData([...result])
      : setCollectedNftData((state) => [...state, ...result]);
    return result;
  }
  async function getMoreWishlistNftsWrapper({
    unset = false,
  }: {
    unset?: boolean;
  }) {
    const res = await fetchWishlistNfts({
      params: {
        username: username,
        skip: unset ? 0 : wishlistNftData.length ?? 0,
        filter,
      },
    });
    const result = Array.isArray(res) ? await parseNFTs(res) : [];
    unset
      ? setWishlistNftData([...result])
      : setWishlistNftData((state) => [...state, ...result]);
    return result;
  }

  // function to get more createdNft data for infinite scroll
  const getMoreCreatedNFT = async () => {
    if (createdNftData.length === 0 || createdNftData.length % 8 !== 0) {
      setHasMoreCreatedNftData(false);
      return;
    }
    const result = await getMoreCreatedNftsWrapper({});
    if (profile.nftCreated <= 8 || result.length < 8)
      setHasMoreCreatedNftData(false);
    if (profile.nftCreated && createdNftData.length >= profile.nftCreated)
      setHasMoreCreatedNftData(false);
  };

  // function to get more collectedNft data for infinite scroll
  const getMoreCollectedNFT = async () => {
    if (collectedNftData.length === 0 || collectedNftData.length % 8 !== 0) {
      setHasMoreCollectedNftData(false);
      return;
    }
    const result = await getMoreCollectedNftsWrapper({});
    if (result.length < 8) setHasMoreCollectedNftData(false);
    if (profile.nftOwned && collectedNftData.length >= profile.nftOwned)
      setHasMoreCollectedNftData(false);
  };

  // function to get more wishlistNft data for infinite scroll
  const getMoreWishlistNFT = async () => {
    if (!isMyProfile || wishlistNftData.length % 8 !== 0) {
      setHasMoreWishlistNftData(false);
      return;
    }
    const result = await getMoreWishlistNftsWrapper({});
    if (result.length < 8) setHasMoreWishlistNftData(false);
  };

  function updateFilter(value: FILTERS_TYPE) {
    setFilter(value);
  }

  useEffect(() => {
    setCategory(CATEGORIES[0]); // set category to default when profile is changed. This is to prevent setting wishlist to active when you move from myProfile to other's profile
    setHasMoreCreatedNftData(true);
    setHasMoreCollectedNftData(true);
    user?.attributes?.username === profile?.username
      ? setIsMyProfile(true)
      : setIsMyProfile(false);
    isMyProfile ?? setHasMoreWishlistNftData(true);
  }, [user, profile]);

  // reset filters when category is changed
  useEffect(() => {
    setFilter(FILTERS[0]);
  }, [category]);

  // check if the person visiting this profile is following the user
  useEffect(() => {
    async function setup() {
      const res = await isFollowingUser(profile?.objectId);
      setIsFollowing(res === true ? true : false);
    }
    setup();
  }, [profile]);

  // function that checks if the person viewing this profile is following the user
  async function isFollowingUser(followingId: string) {
    let result = false;
    if (isAuthenticated && isInitialized) {
      result = await Moralis.Cloud.run("isFollowingUser", {
        followingId,
      });
    }
    return result;
  }

  const [followUnfollowProfileLoading, setFollowUnfollowProfileLoading] =
    useState(false);

  // Function to follow/unfollow this profile by a loggedin user
  const followUnfollowUser = async (followingId: string) => {
    if (isInitialized && isAuthenticated) {
      setFollowUnfollowProfileLoading(true);
      const isFollowing = await isFollowingUser(followingId);
      if (isFollowing == true) {
        const result = await Moralis.Cloud.run("unfollowUser", {
          followingId: followingId,
        });
        if (result == "unfollowed") {
          setProfile((profile) => ({
            ...profile,
            followers: profile.followers - 1,
          }));
          // profile.followers--;
          setIsFollowing(false);
        }
      } else {
        const result = await Moralis.Cloud.run("followUser", {
          followingId: followingId,
        });
        if (result == "Followed" || result == "Already following") {
          setProfile((profile) => ({
            ...profile,
            followingUsers: [
              ...(profile.followingUsers ? profile.followingUsers : []),
              {
                // createdAt: new Date(),
                createdAt: "",
                updatedAt: "",
                objectId: "",
                following: {
                  objectId: user?.id ?? "",
                  name: user?.attributes.name ?? "",
                  username: user?.attributes.username ?? "",
                  profilePic: {
                    url: user?.attributes?.profilePic?.url ?? "",
                  },
                },
              },
            ],
            followers: profile.followers + 1,
          }));
          setIsFollowing(true);
        }
      }
      setFollowUnfollowProfileLoading(false);
    } else {
      dispatch(
        addNotification({
          type: "error",
          message: "You are not logged in",
        })
      );
    }
  };

  const [followUnfollowUserLoading, setFollowUnfollowUserLoading] =
    useState(false);

  // function to unfollow a user by the owner of the profile
  // to be used strictly only in social modal
  async function unFollowUser(followingId: string, username: string) {
    try {
      setFollowUnfollowUserLoading(true);
      // check if the profile owner already follows this user
      const isFollowing = await isFollowingUser(followingId);
      // if the profile owner doesn't follow this user
      if (!isFollowing) {
        dispatch(
          addNotification({
            type: "error",
            message: "You don't follow this user",
          })
        );
        return;
      }
      const result = await Moralis.Cloud.run("unfollowUser", {
        followingId: followingId,
      });
      if (result === "unfollowed") {
        // filter the following users to removed the unfollowed user
        const currentlyFollowingUsers = profile.followingUsers?.filter(
          (followingUser: USER_SOCIAL_FOLLOWING) =>
            followingUser.following.objectId !== followingId
        );
        // update the profile
        setProfile({
          ...profile,
          followingUsers: currentlyFollowingUsers
            ? [...currentlyFollowingUsers]
            : [],
          following: currentlyFollowingUsers
            ? currentlyFollowingUsers.length
            : 0,
        });
      }
      dispatch(
        addNotification({
          type: "success",
          message: `You unfollowed ${username}`,
        })
      );
      setFollowUnfollowUserLoading(false);
    } catch (error: any) {
      dispatch(
        addNotification({
          type: "error",
          message: "Failed to unfollow users",
        })
      );
      setFollowUnfollowUserLoading(false);
    }
  }

  // function to follow a user by the owner of the profile
  // to be used strictly only in social modal
  async function followUser(followingId: string, username: string) {
    try {
      setFollowUnfollowUserLoading(true);
      // check if the profile owner already follows this user
      const isFollowing = await isFollowingUser(followingId);
      // if the profile owner already follows this user
      if (isFollowing) {
        dispatch(
          addNotification({
            type: "error",
            message: `You follow ${username}`,
          })
        );
        setFollowUnfollowUserLoading(false);
        return;
      }
      const result = await Moralis.Cloud.run("followUser", {
        followingId,
      });

      if (result == "Followed" || result == "Already following") {
        // get the data of the user to follow
        const newUserToFollow = profile.followersUsers?.filter(
          (followingUser) => followingUser.follower.objectId === followingId
        )[0].follower;

        // add the data to the list of people you already follow
        let currentlyFollowedUsers = [
          ...(profile.followingUsers ? profile.followingUsers : []),
          {
            createdAt: "",
            updatedAt: "",
            objectId: "",
            following: newUserToFollow,
          },
        ];

        // update the profile
        setProfile({
          ...profile,
          followingUsers: currentlyFollowedUsers
            ? [...currentlyFollowedUsers]
            : [],
          following: currentlyFollowedUsers ? currentlyFollowedUsers.length : 0,
        });
      }
      dispatch(
        addNotification({
          type: "success",
          message: `You follow ${username} now`,
        })
      );
      setFollowUnfollowUserLoading(false);
    } catch (error: any) {
      dispatch(
        addNotification({
          type: "error",
          message: "Failed to follow users",
        })
      );
      setFollowUnfollowUserLoading(false);
    }
  }

  const updateCategory = (category: CATEGORIES_TYPE) => {
    setCategory(category);
  };

  // this function decides what to render when any filters is changed from the dropdown or the header
  function renderer() {
    switch (category) {
      case "created":
        return (
          <>
            {createdNftError ? (
              <NoData
                heading="Oops, an error just occured"
                message="This may be due to network issues, refresh your browser"
                text=""
                href=""
              />
            ) : (createdNftLoading && !createdNftError) ||
              (profile.nftCreated > 0 && createdNftData.length === 0) ? (
              <GridHelper>
                {[1, 2, 3, 4].map((auction) => (
                  <LoadingArtworkCard key={auction} />
                ))}
              </GridHelper>
            ) : (createdNftData.length === 0 && !createdNftLoading) ||
              (!createdNftLoading && createdNftData?.length == 0) ? (
              isMyProfile ? (
                <NoData
                  text="Create"
                  heading="Oops, its empty"
                  href="/create"
                  message="You haven’t created any NFT"
                />
              ) : (
                <NoData
                  text="Explore"
                  heading="Oops, its empty"
                  href="/discover/artist"
                  message={`${
                    profile.name ? profile.name.split(" ")[0] : "This user"
                  } hasn't created an NFT`}
                />
              )
            ) : (
              <InfiniteScroll
                dataLength={createdNftData.length}
                next={getMoreCreatedNFT}
                hasMore={hasMoreCreatedNftData}
                loader={
                  <LoadingAnimation className="loadmore" />
                  // <>
                  //   <div style={{ height: "3.5rem" }}></div>
                  //   <GridHelper>
                  //     {[1, 2, 3, 4].map((auction) => (
                  //       <LoadingArtworkCard key={auction} />
                  //     ))}
                  //   </GridHelper>
                  // </>
                }
                endMessage={""}
              >
                <GridHelper>
                  {createdNftData.map((auction: NFT) => (
                    <ArtworkCard data={auction} key={auction.id} />
                  ))}
                </GridHelper>
              </InfiniteScroll>
            )}
          </>
        );
      case "collected":
        return (
          <>
            {collectedNftError ? (
              <NoData
                heading="Oops, an error just occured"
                message="This may be due to network issues, refresh your browser"
                text=""
                href=""
              />
            ) : (collectedNftLoading && !collectedNftError) ||
              (profile.nftOwned > 0 && collectedNftData.length === 0) ? (
              <GridHelper>
                {[1, 2, 3, 4].map((auction) => (
                  <LoadingArtworkCard key={auction} />
                ))}
              </GridHelper>
            ) : (collectedNftData.length === 0 && !collectedNftLoading) ||
              (!collectedNftLoading && collectedNftData?.length == 0) ? (
              isMyProfile ? (
                <NoData
                  text="Browse"
                  heading="Oops, its empty"
                  href="/discover/artwork"
                  message="There are lots of NFT’s to explore"
                />
              ) : (
                <NoData
                  text="Explore"
                  heading="Oops, its empty"
                  href="/discover/artist"
                  message={`${
                    profile.name ? profile.name.split(" ")[0] : "This user"
                  } hasn't collected any NFT`}
                />
              )
            ) : (
              <InfiniteScroll
                dataLength={collectedNftData.length}
                next={getMoreCollectedNFT}
                hasMore={hasMoreCollectedNftData}
                loader={<LoadingAnimation className="loadmore" />}
                endMessage={""}
              >
                <GridHelper>
                  {collectedNftData.map((auction: NFT, index: any) => (
                    <ArtworkCard data={auction} key={auction.id} />
                  ))}
                </GridHelper>
              </InfiniteScroll>
            )}
          </>
        );
      case "wishlist":
        if (!isMyProfile) {
          return;
        }
        return (
          <>
            {wishlistNftError ? (
              <NoData
                heading="Oops, an error just occured"
                message="This may be due to network issues, refresh your browser"
                text=""
                href=""
              />
            ) : wishlistNftLoading && !wishlistNftError ? (
              <GridHelper>
                {[1, 2, 3, 4].map((auction) => (
                  <LoadingArtworkCard key={auction} />
                ))}
              </GridHelper>
            ) : (wishlistNftData.length === 0 && !wishlistNftLoading) ||
              (!wishlistNftLoading && wishlistNftData?.length == 0) ? (
              <NoData
                heading="Oops, its empty"
                message="There are lots of NFT's to explore"
                text="Browse"
                href="/discover/artwork"
              />
            ) : (
              <InfiniteScroll
                dataLength={wishlistNftData.length}
                next={getMoreWishlistNFT}
                hasMore={hasMoreWishlistNftData}
                loader={<LoadingAnimation className="loadmore" />}
                endMessage={""}
              >
                <GridHelper>
                  {wishlistNftData.map((auction: NFT, index: any) => (
                    <ArtworkCard data={auction} key={auction.id} />
                  ))}
                </GridHelper>
              </InfiniteScroll>
            )}
          </>
        );
    }
  }

  const homepage =
    process.env.APP_ENV === "testnet"
      ? "https://www.testnet.vizva.io"
      : "https://www.vizva.io";

  return (
    <React.Fragment key={username}>
      <Navbar />
      <Head>
        <title>{profile.name}</title>

        {/* facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${homepage}/${profile.username}`} />
        <meta property="og:title" content={profile.username} />
        <meta property="og:image" content={profile?.profilePic?.url} />

        {/* twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={profile.username} />
        <meta property="twitter:image" content={profile?.profilePic?.url} />

        {/* change to handle of the owners */}
        <meta property="twitter:site" content="@intovizva" />
        <meta property="twitter:creator" content="@intovizva" />
      </Head>
      <>
        <CoverPicHeader
          isMyProfile={isMyProfile}
          isFollowing={isFollowing}
          coverPic={profile?.coverPic?.url}
          profilePic={profile?.profilePic?.url}
          ethAddress={profile.ethAddress}
          id={profile.objectId}
          followUnfollowUser={followUnfollowUser}
          loading={followUnfollowProfileLoading}
          profile={profile}
        />
        <MaxWidth>
          <>
            <ProfileDetails
              isMyProfile={isMyProfile}
              isFollowing={isFollowing}
              openSocialModal={openSocialModal}
              updateActiveSocial={updateActiveSocial}
              followUnfollowUser={followUnfollowUser}
              loading={followUnfollowProfileLoading}
              profile={{
                ...profile,
                // objectId: profile.objectId,
                // ethAddress: profile.ethAddress,
                // name: profile.name,
                // username: profile.username,
                // instagram: profile.instagram,
                // twitter: profile.twitter,
                // bio: profile.bio,
                // following: profile.following,
                // followers: profile.followers,
              }}
            />

            <StyledContent>
              <div className="header">
                <CategoryFilter
                  updateCategory={updateCategory}
                  active={category}
                  createdNFTs={profile.nftCreated ?? 0}
                  collectedNFTs={profile.nftOwned ?? 0}
                  wishlistNFTs={profile.nftWishlisted ?? 0}
                  isMyProfile={isMyProfile}
                />

                <TypeFilter active={filter} updateFilter={updateFilter} />
              </div>

              <div className="nft-container">{renderer()}</div>
            </StyledContent>
          </>
        </MaxWidth>
        <Footer />

        {/* {isSocialModalOpen && (
          <StyledBackground
            onClick={() => setIsSocialModalOpen(false)}
          ></StyledBackground>
        )} */}
        {isSocialModalOpen && (
          <SocialModal
            updateActiveSocial={updateActiveSocial}
            isOpen={isSocialModalOpen}
            active={activeSocial}
            close={() => setIsSocialModalOpen(false)}
            profile={profile}
            isMyProfile={isMyProfile}
            followUser={followUser}
            unFollowUser={unFollowUser}
            loading={followUnfollowUserLoading}
          />
        )}
      </>
    </React.Fragment>
  );
}

export const StyledContent = styled.div`
  .header {
    position: relative;
    margin: var(--padding-10) auto 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: max-content max-content;
    align-items: center;
    gap: 1rem;

    div:last-of-type {
      align-self: center;
    }
  }
  & > .nft-container {
    margin-top: var(--padding-9);
    & > p {
      text-align: center;
    }
  }
  ${breakpoint("md")} {
    & > div:first-of-type {
      grid-template-columns: 1fr max-content;
      grid-template-rows: 1fr;
    }
    align-self: start;
  }
  .loadmore {
    width: 300px;
    height: 300px;
    margin: 0 auto;
  }
`;

const StyledBackground = styled.div`
  background-color: transparent;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const data = await fetch(
  //   `${process.env.MORALIS_URL}/functions/getUserInfoWithUsername?_ApplicationId=${process.env.APP_ID}&username=${context?.params?.username}`
  // );

  // const result = await data.json();
  // const { ACL, sessionToken, accounts, authData, ...others } = result.result;
  return {
    props: {
      // profile: others,
      username: context?.params?.username,
    },
  };
};
