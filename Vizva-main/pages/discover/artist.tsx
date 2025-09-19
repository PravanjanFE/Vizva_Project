import styled from "@emotion/styled";
import ArtistCard, { LoadingArtistCard } from "components/layout/artistCard";
import Navbar from "components/navigation/navbar";
import React, { useState, useEffect } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import {
  StyledMenu,
  StyledDiv,
  StyledHeader as Header,
} from "components/pages/discover/style";
import Footer from "components/pages/home/footer";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import GridHelper from "components/layout/gridHelper";
import MaxWidth from "components/layout/maxWidth";
import InfiniteScroll from "react-infinite-scroll-component";
import nProgress from "nprogress";
import { User } from "vizva";
import Head from "next/head";
import NoData from "components/layout/noNft";
import { Menu } from "@headlessui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import LoadingAnimation from "components/animations/Loading";
import Loading from "components/loading";

export default function DiscoverArtist() {
  const router = useRouter();
  const FILTERS = ["newest to oldest", "most created", "most sold"];
  const [filter, setFilter] = useState(router.query.filter ?? FILTERS[0]);
  const [artists, setArtists] = useState<User[]>([]);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);

  const { isInitialized } = useMoralis();

  useEffect(() => {
    nProgress.done();
  }, []);

  // update the url when the filter isn't present in the url
  useEffect(() => {
    if (!router.query.filter)
      router.replace(`/discover/artist?filter=${filter}`);
  }, [router.query.filter]);

  const { error, isLoading, fetch } = useMoralisCloudFunction(
    "getAllUsers",
    { filter, skip: artists.length ?? 0 },
    { autoFetch: false }
  );

  async function fetchWrapper({ unset = false }: { unset?: boolean }) {
    const result: any = await fetch({
      params: { skip: unset ? 0 : artists.length ?? 0, filter },
    });
    if (!result || result?.length === 0) {
      setHasMoreUsers(false);
      return;
    }

    const dataObject: User[] = JSON.parse(JSON.stringify(result));
    unset
      ? setArtists([...dataObject])
      : setArtists((state) => [...state, ...dataObject]);

    // if (dataObject.length < 8) setHasMoreUsers(false);
  }

  useEffect(() => {
    setHasMoreUsers(true);
    if (!!filter && isInitialized) {
      fetchWrapper({ unset: true });
    }
  }, [filter, isInitialized]);

  // update the filter and the url
  function updateFilter(value: string) {
    setFilter(value);
    router.replace(`/discover/artist?filter=${value}`);
  }

  // if (!isInitialized) {
  //   return (
  //     <>
  //       <Head>
  //         <title>Discover Artists</title>
  //       </Head>
  //       <Navbar active="artist" />
  //       {/* <Loading /> */}
  //     </>
  //   );
  // }

  return (
    <>
      <Head>
        <title>Discover Artists</title>
      </Head>
      <Navbar active="artist" />
      <MaxWidth>
        <StyledDiv>
          <StyledHeader>
            <h2 className="header__heading">Artists</h2>
            <Menu as={React.Fragment}>
              <StyledMenu>
                <Menu.Button className="menu__button">
                  <span>
                    <span className="fade">filter by</span> {filter}
                  </span>
                  <FiChevronDown size="20" />
                </Menu.Button>
                <Menu.Items as="ul" className="menu__items">
                  {FILTERS.map((feature) => (
                    <Menu.Item key={feature} as={React.Fragment}>
                      {({ active }: { active: boolean }) => (
                        <li
                          onClick={() => updateFilter(feature)}
                          className={`menu__item ${
                            active ? "menu__item--active" : ""
                          }`}
                        >
                          {feature == filter ? (
                            <FiCheck size="20" />
                          ) : (
                            <svg></svg>
                          )}
                          {feature}
                        </li>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </StyledMenu>
            </Menu>
          </StyledHeader>
          <div className="panels">
            {!isLoading && error ? (
              <NoData
                heading="An error occured"
                message={error.message ?? "Failed to fetch Artists"}
                text="Connect wallet"
                href="/connectwallet"
              />
            ) : (
              <InfiniteScroll
                dataLength={artists.length}
                next={() => fetchWrapper({ unset: false })}
                hasMore={hasMoreUsers}
                loader={<LoadingAnimation className="loadmore" />}
                endMessage={""}
              >
                {artists.length > 0 ? (
                  <GridHelper>
                    {artists.map((artist, index) => (
                      <ArtistCard
                        data={{
                          ...artist,
                          username: artist?.username ? artist.username : "",
                          name: artist?.name ? artist.name : "Vizva User",
                          twitter: artist?.twitter ? artist.twitter : "",
                          following: artist?.following ? artist.following : 0,
                          followers: artist?.followers ? artist.followers : 0,
                          nftCreated: artist?.nftCreated
                            ? artist.nftCreated
                            : 0,
                          bio: artist?.bio ? artist.bio : "",
                        }}
                        key={index}
                      />
                    ))}
                  </GridHelper>
                ) : (
                  <GridHelper>
                    {[1, 2, 3, 4].map((artist) => (
                      <LoadingArtistCard key={artist} />
                    ))}
                  </GridHelper>
                )}
              </InfiniteScroll>
            )}
          </div>
        </StyledDiv>
      </MaxWidth>
      <Footer />
    </>
  );
}

const StyledHeader = styled(Header)`
  margin: 1rem 0 3rem 0;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      _: {},
    },
  };
};
