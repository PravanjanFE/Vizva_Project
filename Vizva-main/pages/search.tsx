import styled from "@emotion/styled";
import Navbar from "components/navigation/navbar";
import { useRouter } from "next/router";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import * as Fi from "react-icons/fi";
import GridHelper from "components/layout/gridHelper";
import ArtistCard, { LoadingArtistCard } from "components/layout/artistCard";
import ArtworkCard, { LoadingArtworkCard } from "components/layout/artworkCard";
import MaxWidth from "components/layout/maxWidth";
import Footer from "components/pages/home/footer";
import processNftDetails from "services/processNft.service";
import { StyledBackground, StyledMenu } from "components/pages/discover/style";
import Header from "components/layout/header";
import { breakpoint } from "public/breakpoint";
import { NFT, User } from "vizva";
import Head from "next/head";
import { Menu } from "@headlessui/react";
// import { getImageUrlFromTokenURI } from "services/helpers";

export default function Discover() {
  const router = useRouter();
  const { Moralis, initialize, isInitialized } = useMoralis();
  const [loading, setLoading] = useState(true);
  const [artistData, setArtistData] = useState<User[]>([]);
  const [artworkData, setArtworkData] = useState<NFT[]>([]);
  const [collectionData, setCollectionData] = useState<NFT[]>([]);
  const [query, setQuery] = useState(() => {
    return router.query.q ?? "";
  });
  const [filter, setFilter] = useState(() => {
    const f = router.query.f ? (router.query.f as string) : "artist";
    // const f = "artist";
    return f;
  });

  // Function to search by passing keyword and filter. The function makes a request to moralis db and returns the result.
  async function searchByKeyword(k: string | string[], f: string) {
    if (isInitialized) {
      setLoading(true);
      setArtworkData([]);
      setArtistData([]);
      setCollectionData([]);
      const result = await Moralis.Cloud.run("searchByKeyword", {
        keyword: k as string,
        filter: f,
      });

      if (f === "artist" && result.length > 0) {
        // if filter is artist
        // rename all profilePic._url keys to profilePic.url and coverPic._url keys to coverPic.url
        const newResult = result.map(
          (r: {
            profilePic: { _url: any; url: any };
            coverPic: { _url: any; url: any };
          }) => {
            if (r.profilePic && r.profilePic._url) {
              r.profilePic.url = r.profilePic._url;
              delete r.profilePic._url;
            }
            if (r.coverPic && r.coverPic._url) {
              r.coverPic.url = r.coverPic._url;
              delete r.coverPic._url;
            }
            return r;
          }
        );
        setArtistData(newResult as User[]);
      } else if (f === "artwork" && result.length > 0) {
        // if filter is artwork
        // map result to Artwork type
        const length = result.length;
        let newResult = [];
        for (let i = 0; i < length; i++) {
          const element = JSON.parse(JSON.stringify(result[i]));
          let res = await processNftDetails(element);
          newResult.push(res);
        }
        setArtworkData(newResult);
      } else if (f === "collection" && result.length > 0) {
        // if filter is collection
        // map result to Artwork type
        const length = result.length;
        let newResult = [];
        for (let i = 0; i < length; i++) {
          const element = JSON.parse(JSON.stringify(result[i]));
          let res = await processNftDetails(element);
          newResult.push(res);
        }
        console.log(newResult)
        setCollectionData(newResult);
      }
      //setLoading(false);
      router.push(`/search?q=${k}&f=${f}`);
      // return result;
    }
  }

  useEffect(() => {
    if (isInitialized) {
      searchByKeyword(query, filter);
    }
  }, [query, filter]);

  useEffect(() => {
    if (isInitialized) {
      setQuery((router.query.q as string) ?? "");
      setFilter((router.query.f as string) ?? "artist");
    }
  }, [router]);

  // useEffect(() => {
  //   if (isInitialized) {
  //     router.push(`/search?q=${query}&f=${filter}`);
  //   }
  // }, [filter]);

  function changeFilter(value: SetStateAction<string>) {
    // router.push(`/search?q=${query}&f=${value}`);
    setFilter(value);
  }

  return (
    <>
      <Head>
        <title>Search</title>
      </Head>
      <Navbar active="search" />
      <MaxWidth>
        <StyledDiv>
          {/* <StyledSearch>
            <input
              id="search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  router.push(`/search?q=${query}`);
                }
              }}
            />
            <span className="icon">
              <Fi.FiSearch />
            </span>
          </StyledSearch> */}

          {query ? (
            <p>
              Search <strong>{query}</strong>
            </p>
          ) : (
            <p></p>
          )}
          <div className="filter">
            <StyledFilter>
              <a
                href="#artist"
                className={filter === "artist" ? "active" : undefined}
                id="artist"
                onClick={(e) => {
                  e.preventDefault();
                  changeFilter("artist");
                }}
              >
                Artist ({artistData.length})
              </a>
              <a
                href="#artwork"
                id="artwork"
                className={filter === "artwork" ? "active" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  changeFilter("artwork");
                }}
              >
                Artwork ({artworkData.length})
              </a>
              <a
                href="#collection"
                id="collection"
                className={filter === "collection" ? "active" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  changeFilter("collection");
                }}
              >
                Collection ({collectionData.length})
              </a>
            </StyledFilter>

            <Menu as={Fragment}>
              <StyledMenu>
                <Menu.Button className="menu__button">
                  <span>
                    <span className="fade">filter by</span> Newest to Oldest
                  </span>
                  <Fi.FiChevronDown size="20" />
                </Menu.Button>
                <Menu.Items as="ul" className="menu__items">
                  {["newest to oldest", "most sold"].map((filter) => (
                    <Menu.Item as={Fragment} key={filter}>
                      {({ active }: { active: boolean }) => (
                        <li
                          className={`menu__item ${
                            active ? "menu__item--active" : ""
                          }`}
                        >
                          {filter == "newest to oldest" ? (
                            <Fi.FiCheck size="20" />
                          ) : (
                            <svg></svg>
                          )}
                          {filter}
                        </li>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </StyledMenu>
            </Menu>
          </div>

          <div className="panels">
            {filter === "artist" && (
              <>
                <div style={{ height: "1rem" }}></div>
                {loading ? (
                  <GridHelper>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((artist) => (
                      <LoadingArtistCard key={artist} />
                    ))}
                  </GridHelper>
                ) : (
                  <>
                    {artistData.length > 0 ? (
                      <GridHelper>
                        {artistData.map((artist, index) => (
                          <ArtistCard
                            data={{
                              ...artist,
                              username: artist?.username ? artist.username : "",
                              name: artist?.name ? artist.name : "Vizva User",
                              twitter: artist?.twitter ? artist.twitter : "",
                              following: artist?.following
                                ? artist.following
                                : 0,
                              followers: artist?.followers
                                ? artist.followers
                                : 0,
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
                      <div className="no-results">
                        <p>No results found</p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {filter === "artwork" && (
              <>
                {loading ? (
                  <GridHelper>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((artwork) => (
                      <LoadingArtworkCard key={artwork} />
                    ))}
                  </GridHelper>
                ) : (
                  <>
                    <div style={{ height: "1rem" }}></div>
                    {artworkData.length > 0 ? (
                      <GridHelper>
                        {artworkData.map((artwork, index) => (
                          <ArtworkCard data={artwork} key={index} />
                        ))}
                      </GridHelper>
                    ) : (
                      <div className="no-results">
                        <p>No results found</p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {filter === "collection" && (
              <>
                {loading ? (
                  <p></p>
                ) : (
                  <>
                    <div style={{ height: "1rem" }}></div>
                    {collectionData.length > 0 ? (
                      {
                        /* <GridHelper>
                    {collectionData.map((collection, index) => (
                      <ArtworkCard
                        data={collection}
                        key={index} />
                    ))}
                  </GridHelper> */
                      }
                    ) : (
                      <div className="no-results">
                        <p>No results found</p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </StyledDiv>
      </MaxWidth>
      <Footer />
    </>
  );
}
const StyledFilter = styled.div`
  display: flex;
  width: 100%;
  overflow: auto;
  & > :not(:last-of-type) {
    margin-right: 20px;
  }

  a {
    &:not(:first-of-type) {
      margin-left: 2rem;
    }
    color: ${(props) => props.theme.gray2};
    transition: 150ms ease;
    padding-bottom: var(--padding-1);
    min-width: 150px;
    text-align: center;

    &.active {
      border-bottom: 2px solid ${(props) => props.theme.primary};
      color: ${(props) => props.theme.primary};
      /* font-weight: 600; */
    }

    &:focus,
    &:hover {
      color: ${(props) => props.theme.primary};
      /* font-weight: 600; */
      outline: none;
    }
  }
`;
const StyledDiv = styled.div`
  position: relative;
  min-height: calc(100vh - 74px);
  padding: var(--padding-1) var(--padding-sm);
  .search {
    height: 50px;
    border-radius: 25px;
  }

  & > p {
    font-size: var(--fontsizes-7);
    padding: var(--padding-5) 0;

    strong {
      font-weight: 500;
      font-size: var(--fontsizes-6);
    }
  }
  .filter {
    position: relative;
    margin: var(--padding-5) auto;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: max-content max-content;
    align-items: center;
    gap: 1rem;

    div:last-of-type {
      align-self: center;
    }
  }

  ${breakpoint("md")} {
    .filter {
      grid-template-columns: 1fr max-content;
      grid-template-rows: 1fr;
    }
  }
`;

const StyledSearch = styled.div`
  position: relative;
  background-color: ${(props) =>
    props.theme.mode == "dark" ? props.theme.gray900 : props.theme.gray400};
  overflow: hidden;
  width: 100%;
  height: 50px;
  min-height: 1rem;
  cursor: pointer;
  border-radius: 40px;

  input {
    appearance: none;
    z-index: 1000;
    position: absolute;
    background: transparent;
    inset: 0;
    width: 100%;
    height: 100%;
    outline: 0;
    border: 0;
    padding: 0 3rem;
    color: ${(props) => props.theme.primary};

    &:focus + .placeholder {
      display: none;
    }
  }

  .icon {
    position: absolute;
    left: 2rem;
    top: 50%;
    transform: translate(-50%, -50%);
    line-height: 100%;
    svg {
      color: ${(props) => props.theme.gray1} !important;
      width: 1rem;
      height: auto;
    }
  }

  .left {
    left: 1rem;
  }

  .right {
    right: 1rem;
  }
`;
function setArtworkData(arg0: User[]) {
  throw new Error("Function not implemented.");
}
