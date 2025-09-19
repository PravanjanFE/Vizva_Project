import styled from "@emotion/styled";
import Button from "components/button";
import Loading from "components/loading";
import Navbar from "components/navigation/navbar";
import Prompt from "components/prompt";
import useNftDetails from "hooks/useNftDetails";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { breakpoint } from "public/breakpoint";
import { useEffect, useState } from "react";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import {
  useCreateLazyBid,
  useValidateWETHBalance,
  useCheckAndGetWETHApproval,
} from "hooks/useBidNFT";
import MaxWidth from "components/layout/maxWidth";
import { types } from "pages/artwork/[id]";
import { useRouter } from "next/router";
import { useAppDispatch } from "redux/hook";
import { addNotification } from "redux/slice/notificationSlice";
import Swal from "sweetalert2";
import Head from "next/head";
import { errorMsg } from "public/error";

export default function PlaceBid({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const [buyDisabled, setBuyDisabled] = useState(false);
  const [minBid, setMinBid] = useState("0");
  const [newBidInWETH, setNewBidInWETH] = useState("0");
  const [newBidder, setNewBidder] = useState<string>("0x");
  const { isAuthenticated, user, web3, Moralis } = useMoralis();
  const {
    loading,
    data: artwork,
    error,
  } = useNftDetails("getSaleNFTinfo", {
    Id: id,
  });
  const router = useRouter();

  const {
    loading: createVoucherLoading,
    error: createBidVoucherError,
    execute: createBidVoucher,
  } = useCreateLazyBid();

  const {
    loading: validateLoading,
    error: validateError,
    execute: validateExecute,
  } = useValidateWETHBalance();

  const {
    loading: WETHApprovalLoading,
    error: WETHApprovalError,
    execute: WETHApprovalExecute,
  } = useCheckAndGetWETHApproval();

  const { fetch: checkAndAcceptBid, isLoading: transferLoading } =
    useMoralisCloudFunction("checkAndAcceptBid", {}, { autoFetch: false });

  async function processInitialData() {
    try {
      if (artwork) {
        const amount = parseFloat(artwork.highestBidInETH);
        const newBid = Math.min(
          parseFloat((amount * 1.1).toFixed(4)),
          amount + 0.1
        );
        const bidInWETH = newBid.toString();
        const bidder = Moralis.account?.toLowerCase();

        if (artwork.highestBidInETH == "0") {
          setMinBid(artwork.amountInETH);
          setNewBidInWETH(artwork.amountInETH);
        } else {
          setMinBid(bidInWETH);
          setNewBidInWETH(bidInWETH);
        }
        setNewBidder(bidder as string);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    processInitialData();
  }, [artwork, loading]);

  const format =
    artwork &&
    types.filter((type) => type.slice(6) === artwork?.format)[0].slice(0, 5);

  const handleBid = async () => {
    try {
      if (new Date(artwork?.endTime.iso as string) < new Date()) {
        Swal.fire("Oops! :(", "Action expired", "error").then(() => {
          router.replace(`/${user?.attributes.username}`);
        });
        throw new Error("auction expired");
      }
      // not needed but its just there for extra security
      // checks if the bid is less than the minimum bid
      if (newBidInWETH < minBid) {
        throw new Error("Your bid cannot be less the minimum bid");
      }
      if (user && artwork && isAuthenticated) {
        if (user.get("ethAddress") == artwork.nft_owner) {
          throw new Error("Owner Can't Place Bid");
        }
        setBuyDisabled(true);
        const bidValue = Moralis.Units.ETH(newBidInWETH);
        const valid = await validateExecute(bidValue);

        // this code added for testing bid feature;
        if (!valid) {
          throw new Error("You doesn't have enough WMATIC in your wallet");
          //await getWETHExecute(bidValue);
        }

        const approval = await WETHApprovalExecute(bidValue);
        if (approval && valid) {
          const signedVoucher = await createBidVoucher(
            artwork.tokenAddress,
            artwork.tokenId,
            artwork.marketId,
            bidValue
          );

          checkAndAcceptBid({
            params: {
              Id: artwork.saleId,
              voucher: { bidder: newBidder, signedVoucher },
            },
            onSuccess: () => {
              dispatch(
                addNotification({
                  type: "success",
                  message: "Bidding Successfull..!",
                })
              );

              sessionStorage.setItem("artwork-bought", artwork.id);
              router.push(
                `/artwork/success/${artwork.id}?price=${newBidInWETH}`
              );
            },
            onError: (error) => {
              const message = errorMsg[error.message] || "Place Bid Error";
              dispatch(
                addNotification({
                  type: "error",
                  message,
                })
              );
              setBuyDisabled(false);
              //throw new Error("Placing Bid Failed");
            },
          });
        }
      }
    } catch (error: any) {
      setBuyDisabled(false);
      dispatch(
        addNotification({
          type: "error",
          message: error.message ?? "Place Bid Error",
        })
      );
    }
  };

  const myArtwork = user?.get("ethAddress") === artwork?.nft_owner;
  const highestBid = artwork ? parseFloat(artwork.highestBidInETH) : 0;
  const lowestBid = parseFloat(minBid);

  return (
    <>
      <Head>
        <title>Place Bid</title>
      </Head>
      <Navbar />
      <MaxWidth>
        {!isAuthenticated || !user ? ( // is user is not authenticated
          <Prompt
            message="Connect your wallet to view this page"
            title="Authentication failed"
            text="Connect wallet"
            href="/connectwallet"
            closeable={false}
          />
        ) : loading ? ( // if loading
          <Loading isOpen={loading} />
        ) : transferLoading ? (
          <Loading isOpen={transferLoading} message="finalising Transaction" />
        ) : !artwork ? ( // if no artwork is found
          <Prompt
            message="No artwork found"
            closeable={false}
            text="Home"
            href="/"
          />
        ) : myArtwork ? (
          <Prompt
            title="You cannot place a bid on your own NFT"
            message="This is your NFT and you cannot place a bid on it"
            text="Go home"
            href="/"
            closeable={false}
          />
        ) : (
          <StyledContainer>
            {buyDisabled && <Loading isOpen={buyDisabled} />}
            <div className="image-container">
              <div className="media-container">
                {format === "image" && (
                  <Image
                    alt={artwork.title}
                    src={artwork.file}
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center center"
                    quality={75}
                    sizes="300px"
                  />
                )}
                {format === "video" && (
                  <video src={artwork.file} controls autoPlay={false}></video>
                )}
                {format === "audio" && (
                  <audio src={artwork.file} controls autoPlay={false}></audio>
                )}
              </div>
            </div>

            <StyledDiv>
              <div className="container">
                <h1>Place a bid</h1>
                <p>
                  for <strong>{artwork.title}</strong> by{" "}
                  <strong>{artwork.createdBy.username}</strong>
                </p>

                <div className="bid-info">
                  <p>Highest Bid</p>
                  <span>{`${highestBid.toFixed(3)} ${artwork.currency} (~$${(
                    3042.88 * highestBid
                  ).toFixed(3)})`}</span>
                </div>

                <div className="bid-info">
                  <p>You must bid atleast</p>
                  <span>{`${lowestBid} ${artwork.currency} (~$${(
                    lowestBid * 3042.88
                  ).toFixed(3)})`}</span>
                </div>
              </div>

              <div className="container-2">
                <div className="input-container">
                  <div className="input">
                    <p>Your bid amount</p>
                    <input
                      type="number"
                      value={newBidInWETH}
                      placeholder="0"
                      min={lowestBid}
                      step={0.1}
                      onChange={(e) => {
                        setNewBidInWETH(e.target.value);
                      }}
                    />
                    <span className="currency">{artwork.currency}</span>
                  </div>
                  {newBidInWETH &&
                    !/^(\.[0-9]*)$|^([0-9]+(\.[0-9]*)?)$/gm.test(
                      newBidInWETH
                    ) && <p className="error">invalid input</p>}
                </div>
                <StyledBottomButtons>
                  <Button
                    variant="outline"
                    text="Return back"
                    block
                    disabled={buyDisabled}
                    href={`/artwork/${artwork.id}`}
                  />
                  <Button
                    text="Place bid"
                    block
                    onClick={() => handleBid()}
                    loading={buyDisabled}
                    disabled={
                      !/^(\.[0-9]*)$|^([0-9]+(\.[0-9]*)?)$/gm.test(
                        newBidInWETH
                      ) || newBidInWETH < minBid
                    }
                  />
                </StyledBottomButtons>
              </div>
            </StyledDiv>
          </StyledContainer>
        )}
      </MaxWidth>
    </>
  );
}

const StyledDiv = styled.div`
  display: grid;
  grid-template-rows: auto max-content;
  overflow: visible;
  .container {
    padding: var(--padding-4) 0 0 0;
    overflow: auto;
  }
  h1 {
    font-size: var(--fontsizes-7);
    line-height: 1em;
  }
  strong {
    font-weight: 500;
    text-transform: capitalize;
  }
  p {
    line-height: 1.5em;
  }
  .bid-info {
    margin-top: var(--padding-7);
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${(props) => props.theme.gray4};
    & > p {
      color: ${(props) => props.theme.gray1};
    }
    & > span {
      font-weight: 450;
      line-height: 1.7em;
    }
  }
  .input-container {
    margin-top: var(--padding-8);
    p.error {
      color: red;
    }
  }
  .input {
    background-color: ${(props) =>
      props.theme.mode === "light" ? props.theme.black : props.theme.gray2};
    width: 100%;
    position: relative;
    height: 100%;
    color: ${(props) =>
      props.theme.mode === "light" ? props.theme.gray3 : props.theme.black};
    padding: 1rem 1rem;
    p {
      color: inherit;
      z-index: 1;
    }
    input {
      background-color: transparent;
      display: block;
      width: 100%;
      height: 50px;
      outline: none;
      border: none;
      color: inherit;
      font-size: var(--fontsizes-7);

      /* Chrome, Safari, Edge, Opera */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Firefox */
      & {
        -moz-appearance: textfield;
      }
    }
    .currency {
      color: inherit;
      position: absolute;
      right: 1rem;
      height: calc(50px + 2rem);
      bottom: 0;
      width: min-content;
      font-weight: 450;
      display: grid;
      place-items: center;
    }
  }

  ${breakpoint("lg")} {
    .input-container {
      margin-top: var(--padding-4);
    }
    .container {
      padding-top: var(--padding-7);
    }
    .container,
    .container-2 {
      padding-left: var(--padding-7);
      padding-right: var(--padding-7);
    }
  }
  ${breakpoint("3xl")} {
    overflow: hidden;
    .bid-info {
      margin-top: var(--padding-8);
    }
  }
`;
const StyledContainer = styled.div`
  line-height: calc(1.5 * 1rem);
  height: 100%;
  min-height: calc(100vh - 100px);
  max-height: calc(100vh - 100px);
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
  & > .image-container {
    min-height: 15rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => props.theme.onBackground};
    padding: 20px;

    .media-container {
      position: relative;
      width: 100%;
      height: 100%;
    }
    video,
    audio {
      width: 100%;
      object-fit: cover;
    }

    & > .seen {
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
      background-color: #8080804b;
      span {
        color: white;
        mix-blend-mode: initial;
      }
    }
  }
  ${breakpoint("lg")} {
    overflow: hidden;
    grid-template-columns: 1fr 1fr;
  }
`;
const StyledBottomButtons = styled.div`
  display: flex;
  padding: var(--padding-4) 0;
  flex-direction: column;
  gap: 1rem;

  ${breakpoint("sm")} {
    flex-direction: row;
    justify-content: space-between;
    padding: var(--padding-4) var(--padding-7);
  }
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      id: context.params ? (context.params.id as string) : "",
    },
  };
};
