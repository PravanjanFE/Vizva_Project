import styled from "@emotion/styled";
import ArtworkCard from "components/layout/artworkCard";
import GridHelper from "components/layout/gridHelper";
import Navbar from "components/navigation/navbar";
import useMultipleNftDetails from "hooks/useMultipleNftDetails";
import Loading from "components/loading";
import Footer from "components/pages/home/footer";
import MaxWidth from "components/layout/maxWidth";
import Head from "next/head";
import NoData from "components/layout/noNft";
import { useMoralis } from "react-moralis";
import Prompt from "components/prompt";

export default function Bids() {
  // this will return all the nft logged in user placed bid.
  // key bids contains all the bid placed by the user on that Nft
  const { user, isAuthenticated } = useMoralis();
  const { loading, error, data } = useMultipleNftDetails("getBidsByUser");

  // this should return the users active bids
  // const {
  //   loading: auctionByUserLoading,
  //   error: auctionByUserError,
  //   data: auctionByUser,
  // } = useMultipleNftDetails("getAllAuctionByUser");

  return (
    <>
      <Head>
        <title>My Bids</title>
      </Head>
      <Navbar />
      <MaxWidth>
        <>
          {!isAuthenticated ? (
            <Prompt
              title="Authorization failed"
              message="Connect your wallet to access this page"
              text="Connect wallet"
              href="/connectwallet"
            />
          ) : (
            <StyledDiv>
              <h1>Bids</h1>
              <p>
                Scroll to find artists or artworks on our marketplace, with a
                style and vision that excite you. Once you’ve found your gem,
                place that first bid.
              </p>
              <>
                {loading ? (
                  <Loading isOpen={loading} />
                ) : data.length > 0 ? (
                  <>
                    <div style={{ height: "1rem" }}></div>
                    <GridHelper>
                      {[...data].map((auction, index) => (
                        <ArtworkCard
                          data={auction}
                          key={index}
                          // href={`/bids/${auction.id}`}
                        />
                      ))}
                    </GridHelper>
                  </>
                ) : (
                  <NoData
                    heading="Oops its empty!"
                    message="There are lot of NFT’s to explore"
                    text="Browse"
                    href="/discover/artwork?category=live%20auction"
                  />
                )}
              </>
            </StyledDiv>
          )}
        </>
      </MaxWidth>
      <Footer />
    </>
  );
}

const StyledDiv = styled.div`
  min-height: 100vh;
  & > h1 {
    text-align: center;
    margin: 3rem 0 1.5rem;
    font-size: var(--fontsizes-7);
  }
  & > p {
    text-align: center;
    max-width: 37ch;
    margin: 1rem auto 5rem auto;
    color: ${(props) => props.theme.gray2};
    line-height: calc(1.5 * 1rem);
  }
`;
