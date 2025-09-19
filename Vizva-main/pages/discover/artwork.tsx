import MaxWidth from "components/layout/maxWidth";
import Navbar from "components/navigation/navbar";
import Footer from "components/pages/home/footer";
import Head from "next/head";
// import useRouter from "next/router";
import React, { useEffect, useState } from "react";
import {
  StyledMenu,
  StyledDiv,
  StyledHeader as Header,
} from "components/pages/discover/style";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import styled from "@emotion/styled";
import nProgress from "nprogress";
import { Menu } from "@headlessui/react";
import { breakpoint } from "public/breakpoint";
import { NFT } from "vizva";
import useMultipleNftDetails, { parseNFTs } from "hooks/useMultipleNftDetails";
import InfiniteScroll from "react-infinite-scroll-component";
import ArtworkCard, { LoadingArtworkCard } from "components/layout/artworkCard";
import GridHelper from "components/layout/gridHelper";
import { GetServerSideProps } from "next";
import { useMoralis } from "react-moralis";
import NoData from "components/layout/noNft";
import { useRouter } from "next/router";
import LoadingAnimation from "components/animations/Loading";

const CATEGORIES = ["all", "live auction", "instant sale"];

const FILTERS = [
  "recently added",
  "auction ending soon",
  "price: high to low",
  "price: low to high",
];

export default function DiscoverNFTs() {
  const router = useRouter();
  const [category, setCategory] = useState(
    router.query.category ?? CATEGORIES[0]
  );
  const [filter, setFilter] = useState(router.query.filter ?? FILTERS[0]);
  const [liveAuctionData, setLiveAuctionData] = useState<NFT[]>([]);
  const [instantSaleData, setInstantSaleData] = useState<NFT[]>([]);
  const [hasMoreAuctionData, setHasMoreAuctionData] = useState(true);
  const [hasMoreSaleData, setHasMoreSaleData] = useState(true);
  const [hasMoreData, setHasMoreData] = useState(true);

  const { isInitialized } = useMoralis();

  // update the url when the category or filter isn't present in the url
  useEffect(() => {
    if (!router.query.category || !router.query.filter)
      router.replace(`/discover/artwork?category=${category}&filter=${filter}`);
  }, [router.query.category, router.query.filter]);

  useEffect(() => {
    nProgress.done();
    return () => {
      setLiveAuctionData([]);
      setInstantSaleData([]);
    };
  }, []);

  const {
    data: liveAuction,
    error: liveAuctionError,
    loading: liveAuctionLoading,
    fetch: fetchAuctionSale,
    isFetching: liveAuctionFetching,
  } = useMultipleNftDetails(
    "getAllOnAuctionItems",
    {},
    {
      autoFetch: false,
    }
  );

  const {
    data: instantSale,
    error: instantSaleError,
    loading: instantSaleLoading,
    fetch: fetchInstantSale,
    isFetching: instantSaleFetching,
  } = useMultipleNftDetails(
    "getAllOnSaleItems",
    {},
    {
      autoFetch: false,
    }
  );

  async function fetchAuctionSaleWrapper({
    params,
    unset = false,
  }: {
    params: any;
    unset?: boolean;
  }) {
    const res = await fetchAuctionSale({ params });
    const result = Array.isArray(res) ? await parseNFTs(res) : [];
    unset
      ? setLiveAuctionData(result)
      : setLiveAuctionData((state) => [...state, ...result]);
    return result;
  }

  async function fetchInstantSaleWrapper({
    params,
    unset = false,
  }: {
    params: any;
    unset?: boolean;
  }) {
    const res = await fetchInstantSale({ params });
    const result = Array.isArray(res) ? await parseNFTs(res) : [];
    unset
      ? setInstantSaleData(result)
      : setInstantSaleData((state) => [...state, ...result]);
    return result;
  }

  // fetch NFTs when filter or category changes
  useEffect(() => {
    if (!filter || !category || !isInitialized) return;
    // setInstantSaleData([]);
    // setLiveAuctionData([]);
    setHasMoreSaleData(true);
    setHasMoreAuctionData(true);
    setHasMoreData(true);
    let params: any = {};
    if (filter === "price: high to low") {
      params = {
        filter: category === "live auction" ? "highestBid" : "price",
        sort: "descending",
      };
    }
    if (filter === "price: low to high") {
      params = {
        filter: category === "live auction" ? "highestBid" : "price",
        sort: "ascending",
      };
    }
    if (filter === "auction ending soon") {
      params = {
        filter: "endTime.iso",
        sort: "descending",
      };
    }
    if (category === "instant sale") {
      fetchInstantSaleWrapper({ params, unset: true });
    } else if (category === "live auction") {
      fetchAuctionSaleWrapper({ params, unset: true });
    } else {
      fetchInstantSaleWrapper({ params, unset: true });
      fetchAuctionSaleWrapper({ params, unset: true });
    }
  }, [filter, category, isInitialized]);

  // set hasMoreData to false if there are no more liveAuction and instantSale data
  useEffect(() => {
    if (!hasMoreAuctionData && !hasMoreSaleData) {
      setHasMoreData(false);
    }
  }, [hasMoreAuctionData, hasMoreSaleData]);

  // update the filter and the url
  function updateFilter(value: string) {
    setFilter(value);
    router.replace(`/discover/artwork?category=${category}&filter=${value}`);
  }

  // update the category and the url
  function updateCategory(value: string) {
    setCategory(value);
    router.replace(`/discover/artwork?category=${value}&filter=${filter}`);
  }

  /**
   *
   * These functions fetch the next page of data
   *
   */

  // function get more data for infinite scroll
  const getMoreData = async () => {
    if (liveAuctionData.length === 0 && instantSaleData.length === 0) {
      setHasMoreData(false);
      return;
    }
    getMoreLiveAuction();
    getMoreInstantSale();
  };

  // function to get more instant sale data for infinite scroll
  const getMoreInstantSale = async () => {
    let params: any = {
      skip: instantSaleData.length ?? 0,
    };
    if (filter == "price: high to low") {
      params = {
        skip: instantSaleData.length ?? 0,
        filter: "price",
        sort: "descending",
      };
    } else if (filter == "price: low to high") {
      params = {
        skip: instantSaleData.length ?? 0,
        filter: "price",
        sort: "ascending",
      };
    }
    const fetchData = await fetchInstantSaleWrapper({ params });
    if (fetchData.length === 0) {
      setHasMoreSaleData(false);
    }
  };

  // function to get more liveAuction data for infinite scroll
  const getMoreLiveAuction = async () => {
    let params: any = {
      skip: liveAuctionData.length ?? 0,
    };
    if (filter == "price: high to low") {
      params = {
        skip: liveAuctionData.length ?? 0,
        filter: "highestBid",
        sort: "descending",
      };
    }
    if (filter == "price: low to high") {
      params = {
        skip: liveAuctionData.length ?? 0,
        filter: "highestBid",
        sort: "ascending",
      };
    }
    if (filter === "auction ending soon") {
      params = {
        skip: liveAuctionData.length ?? 0,
        filter: "endTime.iso",
        sort: "descending",
      };
    }
    const fetchData = await fetchAuctionSaleWrapper({ params });
    if (fetchData.length === 0) {
      setHasMoreAuctionData(false);
    }
  };

  return (
    <>
      <Head>
        <title>Discover Artists</title>
      </Head>
      <Navbar active="Artwork" />
      <MaxWidth>
        <StyledDiv>
          <StyledHeader>
            <h2 className="header__heading">Artworks</h2>
            <Menu as={React.Fragment}>
              <StyledMenu>
                <Menu.Button className="menu__button">
                  <span>
                    <span className="fade">filter by</span> {category} -{" "}
                    {filter}
                  </span>
                  <FiChevronDown size="20" />
                </Menu.Button>
                <Menu.Items as="ul" className="menu__items">
                  <p className="menu__label">category list</p>

                  {CATEGORIES.map((cat) => (
                    <Menu.Item key={cat} as={React.Fragment}>
                      {({ active }: { active: boolean }) => (
                        <li
                          onClick={() => updateCategory(cat)}
                          className={`menu__item ${
                            active ? "menu__item--active" : ""
                          }`}
                        >
                          {cat == category ? (
                            <FiCheck size="20" />
                          ) : (
                            <svg></svg>
                          )}
                          {cat}
                        </li>
                      )}
                    </Menu.Item>
                  ))}
                  <div className="menu__divider"></div>
                  <p className="menu__label">feature list</p>
                  {FILTERS.map((feature) =>
                    !(
                      feature == "auction ending soon" &&
                      (category == "instant sale" || category === "all")
                    ) ? (
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
                    ) : (
                      <li key={feature} style={{ display: "none" }}></li>
                    )
                  )}
                </Menu.Items>
              </StyledMenu>
            </Menu>
          </StyledHeader>

          <div className="panels">
            {category === "all" ? (
              <InfiniteScroll
                dataLength={[...instantSaleData, ...liveAuctionData].length}
                next={getMoreData}
                hasMore={hasMoreData}
                loader={<LoadingAnimation className="loadmore" />}
                endMessage={""}
              >
                {/* this div is here so it dosen't block the timer from showing */}
                {[...instantSaleData, ...liveAuctionData].length > 0 ? (
                  <>
                    <div style={{ height: "2rem" }}></div>
                    <GridHelper>
                      {[...instantSaleData, ...liveAuctionData]
                        .sort((a, b) => {
                          if (filter === "price: high to low") {
                            return parseFloat(b.amount) - parseFloat(a.amount);
                          }
                          if (filter === "price: low to high") {
                            return parseFloat(a.amount) - parseFloat(b.amount);
                          }
                          return (
                            new Date(b.saleCreated).getTime() -
                            new Date(a.saleCreated).getTime()
                          );
                        })
                        .map((artwork, index) => (
                          <ArtworkCard
                            data={artwork}
                            key={`both-data-${index}`}
                          />
                        ))}
                    </GridHelper>
                  </>
                ) : instantSaleLoading &&
                  instantSaleFetching &&
                  liveAuctionLoading &&
                  liveAuctionFetching ? (
                  <Loader />
                ) : (
                  <NoData
                    message="Be the first to create an Artwork"
                    href="/create"
                    text="Create artwork"
                  />
                )}
              </InfiniteScroll>
            ) : category === "instant sale" ? (
              <InfiniteScroll
                dataLength={instantSaleData.length}
                next={getMoreInstantSale}
                hasMore={hasMoreSaleData}
                loader={<LoadingAnimation className="loadmore" />}
                endMessage={""}
              >
                {instantSaleData.length > 0 ? (
                  <>
                    <div style={{ height: "1rem" }}></div>
                    <GridHelper>
                      {instantSaleData
                        .sort((a, b) => {
                          if (filter === "price: high to low") {
                            return parseFloat(b.amount) - parseFloat(a.amount);
                          }
                          if (filter === "price: low to high") {
                            return parseFloat(a.amount) - parseFloat(b.amount);
                          }
                          return (
                            new Date(b.saleCreated).getTime() -
                            new Date(a.saleCreated).getTime()
                          );
                        })
                        .map((artwork, index) => (
                          <ArtworkCard
                            data={artwork}
                            key={`instant-data-${index}`}
                          />
                        ))}
                    </GridHelper>
                  </>
                ) : instantSaleLoading && instantSaleFetching ? (
                  <Loader />
                ) : (
                  <NoData
                    message="Be the first to create an Artwork"
                    href="/create"
                    text="Create artwork"
                  />
                )}
              </InfiniteScroll>
            ) : (
              <InfiniteScroll
                dataLength={liveAuctionData.length}
                next={getMoreLiveAuction}
                hasMore={hasMoreAuctionData}
                loader={<LoadingAnimation className="loadmore" />}
                endMessage={""}
              >
                {/* this div is here so it dosen't block the timer from showing */}
                {liveAuctionData.length > 0 ? (
                  <>
                    <div style={{ height: "2rem" }}></div>
                    <GridHelper>
                      {liveAuctionData
                        .sort((a, b) => {
                          if (filter === "price: high to low") {
                            return parseFloat(b.amount) - parseFloat(a.amount);
                          }
                          if (filter === "price: low to high") {
                            return parseFloat(a.amount) - parseFloat(b.amount);
                          }
                          if (filter === "auction ending soon") {
                            return (
                              new Date(a.endTime.iso).getTime() -
                              new Date(b.endTime.iso).getTime()
                            );
                          }
                          return (
                            new Date(b.saleCreated).getTime() -
                            new Date(a.saleCreated).getTime()
                          );
                        })
                        .map((artwork, index) => (
                          <ArtworkCard
                            data={artwork}
                            key={`auction-data-${index}`}
                          />
                        ))}
                    </GridHelper>
                  </>
                ) : liveAuctionLoading && liveAuctionFetching ? (
                  <Loader />
                ) : (
                  <NoData
                    message="Be the first to create an Artwork"
                    href="/create"
                    text="Create artwork"
                  />
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

function Loader() {
  return (
    <GridHelper style={{ marginTop: "3.5rem" }}>
      {[1, 2, 3, 4].map((index) => (
        <LoadingArtworkCard key={`both-${index}`} />
      ))}
    </GridHelper>
  );
}

const StyledHeader = styled(Header)`
  margin: 0 0 2rem 0;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      _: {},
    },
  };
};
