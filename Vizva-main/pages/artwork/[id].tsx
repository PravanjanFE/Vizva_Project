import styled from "@emotion/styled";
import Navbar from "components/navigation/navbar";
import { breakpoint } from "public/breakpoint";
import Theme from "components/layout/Theming";
import Loading from "components/loading";
import Prompt from "components/prompt";
import {
  useInstantBuy,
  useRedeemNFT,
  useTransferNFTonSale,
} from "hooks/useBuyNFT";
import {
  useMoralisCloudFunction,
  useMoralis,
  useMoralisSubscription,
} from "react-moralis";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/dist/client/router";
import Button from "components/button";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import processNftDetails from "services/processNft.service";
import { usefetchPairPrice } from "hooks/useServices";
import { useAppDispatch } from "redux/hook";
import { addNotification } from "redux/slice/notificationSlice";
import ArtworkDetailsLayout from "components/pages/artwork/layout";
import useNftDetails from "hooks/useNftDetails";
import useGetHighestBid from "hooks/useGetHighestBid";
import Link from "next/link";
import nProgress from "nprogress";
import Swal from "sweetalert2";
import { useAcceptBid } from "hooks/useAcceptBid";
import { NFT } from "vizva";
import useMultipleNftDetails from "hooks/useMultipleNftDetails";
import ErrorBoundary from "components/errorBoundary";

export const types = [
  "image/png",
  "image/gif",
  "image/webp",
  "image/jpg",
  "image/jpeg",
  "audio/mp3",
  "audio/mpeg", //confirm
  "video/mp4",
];

export default function DisplayArtwork({
  nft: NFTProp,
  id,
}: {
  nft: NFT;
  id: string;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, user, Moralis } = useMoralis();
  const [buyDisabled, setBuyDisabled] = useState(false);
  const [hasPlacedBid, setHasPlacedBid] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [withdrawBidLoading, setWithdrawBidLoading] = useState(false);
  const [miscError, setMiscError] = useState<string | null>(null);
  const [fiatValue, setFiatValue] = useState(0);
  const [priceInUSD, setPriceInUSD] = useState(0);
  const [nft, setNft] = useState(NFTProp);
  const [saleDB, setSaleDB] = useState<string>("SaleData");
  const { loading, data, error, fetch } = useNftDetails("getSaleNFTinfo", {
    Id: id,
  });
  const { data: priceData } = usefetchPairPrice();
  const bottomButtonRef = useRef<HTMLDivElement>(null);

  useMoralisSubscription("NFTData", (q) => q.equalTo("objectId", id), [], {
    onUpdate: () => {
      fetch();
    },
  });
  useMoralisSubscription(
    data?.type == "instantbuy" ? "SaleData" : "AuctionData",
    (q) => q.equalTo("objectId", data?.saleId),
    [data],
    {
      onUpdate: () => {
        fetch();
      },
    }
  );

  const { data: bidsPlaced } = useMultipleNftDetails("getBidsByUser");

  useEffect(() => {
    if (data) {
      setNft(data);
      const sale = NFTProp.type == "instantbuy" ? "SaleData" : "AuctionData";
      setSaleDB(sale);
    }
  }, [data]);

  useEffect(() => {
    if (bidsPlaced) {
      const bid = bidsPlaced.find((bid) => bid.id === id);
      if (bid) {
        setHasPlacedBid(true);
      }
    }
  }, [bidsPlaced]);

  const {
    loading: instantBuyLoading,
    error: instantBuyError,
    execute: instantBuyExecute,
  } = useInstantBuy();

  const {
    loading: redeemNFTLoading,
    error: redeemNFTError,
    execute: redeemNFTExecute,
  } = useRedeemNFT();

  const {
    loading: acceptBidLoading,
    error: acceptBidError,
    execute: acceptBidExecute,
  } = useAcceptBid();

  const {
    data: transferNFT,
    loading: transferNFTLoading,
    error: transferNFTError,
    execute: transferNFTExecute,
  } = useTransferNFTonSale();

  // when the NFT is transferred after Buying
  useEffect(() => {
    // if (!transferNFTLoading) {
    if (transferNFT) {
      sessionStorage.setItem("artwork-bought", nft.id);
      router.push(`/artwork/success/${nft.id}?price=${nft.amountInETH}`);
    }
    if (error) {
      dispatch(
        addNotification({
          type: "error",
          message: "NFT Data upload failed, Contact admin",
        })
      );
      setBuyDisabled(false);
    }
    // }
  }, [transferNFT]);

  const {
    fetch: processTransfer,
    isLoading: processTransferLoading,
    error: processTransferError,
  } = useMoralisCloudFunction("processInstantSale", {}, { autoFetch: false });

  const { data: highestBidData, loading: highestBidDataLoading } =
    useGetHighestBid(nft.saleId);

  useEffect(() => {
    nProgress.done();
  }, []);

  useEffect(() => {
    if (priceData) setFiatValue(priceData?.["matic-network"]?.usd);
  }, [priceData]);

  useEffect(() => {
    const price = parseFloat(highestBidData?.bidder.bid as string) * fiatValue;
    setPriceInUSD(price);
  }, [highestBidData]);

  useEffect(() => {
    isLikedByUser(nft.id);
    isWishlistedByUser(nft.id);
  }, [nft, user]);

  // error handling
  useEffect(() => {
    if (
      acceptBidError ||
      processTransferError ||
      instantBuyError ||
      redeemNFTError ||
      miscError
    ) {
      console.error(
        acceptBidError ||
          processTransferError ||
          instantBuyError ||
          redeemNFTError ||
          miscError
      ); // for debugging
      Swal.fire(
        "Oops!",
        acceptBidError ||
          processTransferError ||
          instantBuyError ||
          redeemNFTError ||
          miscError,
        "error"
      ).then(() => router.replace("/"));
    }
  }, [
    acceptBidError,
    processTransferError,
    instantBuyError,
    redeemNFTError,
    miscError,
  ]);

  let myNFT = false; // if this user owns the NFT
  if (user != null && nft.nft_owner != null) {
    myNFT = user?.get("ethAddress") === nft.nft_owner;
  }

  // function to check if the user has liked the nft
  const isLikedByUser = async (likeObjectId: string) => {
    if (isAuthenticated) {
      const result = await Moralis.Cloud.run("isLikedByUser", {
        likeClass: "NFTData",
        likeObjectId: likeObjectId,
      });
      result == true ? setIsLiked(true) : setIsLiked(false);
    } else {
      setIsLiked(false);
    }
  };

  // function to check if the user has wishlisted the nft
  const isWishlistedByUser = async (nftId: string) => {
    if (isAuthenticated) {
      const result = await Moralis.Cloud.run("isWishlistedByUser", {
        nftId: nftId,
      });
      result == true ? setIsWishlisted(true) : setIsWishlisted(false);
    } else {
      setIsWishlisted(false);
    }
  };

  const handleBuy = async () => {
    try {
      if (user?.get("ethAddress") == nft.nft_owner) {
        throw new Error("Owner Can't purchase");
      }
      setBuyDisabled(true);
      if (nft.minted) {
        await instantBuyExecute({
          marketId: nft.marketId,
          amount: nft.amount,
          tokenId: nft.tokenId,
          contractAddress: nft.tokenAddress,
        });
      } else {
        await redeemNFTExecute({
          voucher: nft.voucher,
          amount: nft.amount,
          creator: nft.nft_owner,
        });
      }
      await transferNFTExecute({ Id: nft.saleId, amount: nft.amount });

      // const a = await processTransfer({
      //   params: { Id: nft.saleId, amount: nft.amount },
      //   onSuccess: () => {
      //     // addNotification({
      //     //   type: "success",
      //     //   message: "NFT Purchase Sucessful",
      //     // });
      //     sessionStorage.setItem("artwork-bought", nft.id);
      //     router.push(`/artwork/success/${nft.id}?price=${nft.amountInETH}`);
      //   },
      //   onError: (error) => {
      //     dispatch(
      //       addNotification({
      //         type: "error",
      //         message: "NFT Data upload failed, Contact admin",
      //       })
      //     );
      //     setBuyDisabled(false);
      //   },
      // });
    } catch (error: any) {
      setMiscError(error.message);
      setBuyDisabled(false);
    }
  };

  async function withdrawBid() {
    try {
      setBuyDisabled((buyDisabled) => !buyDisabled);
      setWithdrawBidLoading((withdrawBidLoading) => !withdrawBidLoading);
      const result = await Moralis.Cloud.run("withdrawBid", {
        bidId: highestBidData?.objectId,
      });
      setWithdrawBidLoading((withdrawBidLoading) => !withdrawBidLoading);
      if (!result) {
        // add a logic to inform admin about this incident.
        Swal.fire(
          "Something went wrong :(",
          "Please contact admin",
          "error"
        ).then(() => {
          router.replace(`/${user?.attributes.username}`);
        });
      } else {
        Swal.fire("Success", "Bid cancelled", "success").then(() => {
          router.replace(`/${user?.attributes.username}`);
        });
      }
    } catch (error) {
      setBuyDisabled((buyDisabled) => !buyDisabled);
      Swal.fire(
        "Withdrawing bid Failed",
        "Please try again later",
        "error"
      ).then(() => {
        router.replace(`/${user?.attributes.username}`);
      });
    }
  }

  async function handleAcceptBid() {
    try {
      setBuyDisabled((buyDisabled) => !buyDisabled);
      if (nft && highestBidData) {
        const result = await acceptBidExecute(
          highestBidData.signedVoucher,
          highestBidData.bidder.ethAddress
        );
        if (result) {
          const uploadResult = await Moralis.Cloud.run("finalizeBid", {
            ID: nft.saleId as string,
            amount: highestBidData.signedVoucher.bid,
            highestBidId: highestBidData.objectId,
            winner: highestBidData.bidder.ethAddress,
          });

          // uploadResult = false implies NFT Transfered but updating database failed
          if (!uploadResult) {
            // add a logic to inform admin about this incident.
            Swal.fire(
              "Something went wrong :(",
              "Please contact admin",
              "error"
            ).then(() => {
              router.replace(`/${user?.attributes.username}`);
            });
          } else {
            Swal.fire("Success", "NFT transfered sucessfully", "success").then(
              () => {
                router.replace(`/${user?.attributes.username}`);
              }
            );
          }
        }
      } else {
        // console.error("something went wrong please retry");
        Swal.fire("Oh!", "Something went wrong, Please retry", "error").then(
          () => {
            window.location.reload();
          }
        );
      }
    } catch (error) {
      setBuyDisabled((buyDisabled) => !buyDisabled);
      Swal.fire("Accepting bid Failed", "Please try again later", "error").then(
        () => {
          router.replace(`/${user?.attributes.username}`);
        }
      );
    }
  }

  if (processTransferLoading) {
    return (
      <>
        <Navbar />
        <Meta NFTProp={NFTProp} />
        <Theme>
          <Loading
            isOpen={processTransferLoading}
            message="finalising Transaction"
          />
        </Theme>
      </>
    );
  }

  if (!nft) {
    return (
      <>
        <Meta NFTProp={NFTProp} />
        <Prompt
          title="fetching error"
          message="the server didn't return NFT details"
          closeable={false}
          href="/discover/artwork?category=instant sale"
          text="continue viewing"
        />
      </>
    );
  }
  function bidData() {
    // if its loading
    if (highestBidDataLoading) {
      return (
        <div className="bid bid--loading">
          <div className="bid__username--loading"></div>
          <br />
          <div className="bid__price--loading"></div>
        </div>
      );
    }
    // if highestBidData exists, then it isn't on auction or no bid has been placed
    if (nft && highestBidData) {
      bottomButtonRef.current?.classList.replace(
        "bottom-buttons--row",
        "bottom-buttons--column"
      );
      return (
        <div className="bid">
          <p className="bid__username">
            Current bid by{" "}
            <Link href={`/${highestBidData.bidder.username}`}>
              <a>
                <strong>{highestBidData.bidder.username}</strong>
              </a>
            </Link>{" "}
          </p>
          <br />
          <p className="bid__price">
            <strong>
              {`${Moralis.Units.FromWei(highestBidData.signedVoucher.bid)} ${
                nft.currency
              }`}
            </strong>
            {` (~$${priceInUSD.toFixed(3)})`}
          </p>
        </div>
      );
    }

    // if it has stopped loading and no highestBidData i.e no bid has been placed or the NFT isn't on auction
    if (nft.onSale && !highestBidDataLoading) {
      bottomButtonRef.current?.classList.replace(
        "bottom-buttons--row",
        "bottom-buttons--column"
      );
      return (
        <div className="bid">
          <p className="heading">
            {nft.type === "auction" ? "Current bid" : "Price"}
          </p>
          <br />
          {/* <p> */}
          {nft.type === "auction" ? (
            <p className="bid__price">
              <strong>{`${nft.highestBidInETH} ${nft.currency}`}</strong>{" "}
              {`(~$${(parseFloat(nft.highestBidInETH) * fiatValue).toFixed(
                3
              )})`}
            </p>
          ) : (
            <p className="bid__price">
              <strong>{`${nft.amountInETH}MATIC`}</strong>{" "}
              {`($${(parseFloat(nft.amountInETH) * fiatValue).toFixed(3)})`}
            </p>
          )}
          {/* </p> */}
        </div>
      );
    } else {
      return (
        // <div className="current-bid">
        //   <p className="bidder">No Active Bids yet</p>
        // </div>
        <></>
      );
    }
  }
  function bidButtons() {
    if (myNFT && highestBidData) {
      bottomButtonRef.current?.classList.replace(
        "bottom-buttons--row",
        "bottom-buttons--column"
      );
      return (
        <>
          <Button
            block
            variant="outline"
            text="Cancel auction"
            disabled={!isAuthenticated}
          />
          <Button
            block
            text="Accept"
            onClick={() => {
              handleAcceptBid();
            }}
            loading={acceptBidLoading}
            disabled={
              buyDisabled ||
              !highestBidData ||
              highestBidDataLoading ||
              !isAuthenticated
            }
          />
        </>
      );
    }
    if (myNFT && !nft.onSale) {
      bottomButtonRef.current?.classList.replace(
        "bottom-buttons--column",
        "bottom-buttons--row"
      );
      return (
        <>
          {/* <Button
            text="Transfer"
            variant="outline"
            disabled={!isAuthenticated}
          /> */}
          <Button
            text="Put on sale"
            href={`/marketplace/sell/${nft.id}`}
            disabled={!isAuthenticated}
          />
        </>
      );
    }
    if (!myNFT && nft.type === "auction") {
      hasPlacedBid
        ? bottomButtonRef.current?.classList.replace(
            "bottom-buttons--row",
            "bottom-buttons--column"
          )
        : bottomButtonRef.current?.classList.replace(
            "bottom-buttons--column",
            "bottom-buttons--row"
          );
      return (
        <>
          {hasPlacedBid && (
            <Button
              block={hasPlacedBid}
              variant="outline"
              text="Withdraw bid"
              onClick={() => withdrawBid()}
              loading={withdrawBidLoading}
              disabled={
                buyDisabled ||
                !highestBidData ||
                highestBidDataLoading ||
                !isAuthenticated
              }
            />
          )}
          <Button
            block={hasPlacedBid}
            text="Place bid"
            href={`/bids/${id}/place`}
            disabled={highestBidDataLoading || !isAuthenticated}
          />
        </>
      );
    }
    if (!myNFT && nft.onSale && nft.type !== "auction") {
      bottomButtonRef.current?.classList.replace(
        "bottom-buttons--column",
        "bottom-buttons--row"
      );
      return (
        <Button
          className="bid-button"
          text={`Buy for ${nft.amountInETH} MATIC`}
          onClick={() => handleBuy()}
          loading={
            instantBuyLoading || redeemNFTLoading || processTransferLoading
          }
          disabled={myNFT || !isAuthenticated || buyDisabled}
        />
      );
    }
  }

  return (
    <ErrorBoundary>
      <>
        <Navbar />
        <Meta NFTProp={NFTProp} />
        {loading ? (
          <Loading isOpen={loading} />
        ) : error ? (
          <Prompt
            title="an error occured"
            message={error}
            closeable={false}
            text="Go Home"
            href="/"
          />
        ) : (
          <ArtworkDetailsLayout
            // use the data returned from props to load the page until the data from sdk is returned
            nft={nft}
            // nft={data ?? nft}
            myNFT={myNFT}
            isAuthenticated={isAuthenticated}
            isLiked={isLiked}
            isWishlisted={isWishlisted}
            bottomButtons={
              <StyledBottomButtons
                ref={bottomButtonRef}
                className="bottom-buttons-border bottom-buttons--row"
              >
                {bidData()}
                <div className="buttons-container">{bidButtons()}</div>
              </StyledBottomButtons>
            }
          />
        )}
      </>
    </ErrorBoundary>
  );
}

function Meta({ NFTProp }: { NFTProp: NFT }) {
  const homepage =
    process.env.APP_ENV === "testnet"
      ? "https://www.testnet.vizva.io"
      : "https://www.vizva.io";
  return (
    <Head>
      <title>{NFTProp.title} - Vizva</title>
      <meta name="description" content={NFTProp.description} />

      {/* facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${homepage}/artwork/${NFTProp.id}`} />
      <meta property="og:title" content={NFTProp.title} />
      <meta property="og:image" content={NFTProp.file} />
      <meta property="og:description" content={NFTProp.description} />

      {/* twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={NFTProp.title} />
      <meta property="twitter:image" content={NFTProp.file} />

      {/* change to handle of the owners */}
      <meta property="twitter:site" content="@intovizva" />
      <meta property="twitter:creator" content="@intovizva" />
    </Head>
  );
}

export const StyledBottomButtons = styled.div`
  display: flex;
  margin-top: var(--padding-1);
  padding: var(--padding-3);
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.background};
  &.bottom-buttons-border {
    border-top: 1px solid ${(props) => props.theme.secondary};
  }
  & > :first-of-type {
    margin-bottom: 0.5rem;
  }
  .current-bid {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    .bidder {
      color: ${(props) => props.theme.secondary};
      .bidder-username {
      }
    }
    span {
      font-size: var(--fontsizes-6);
      line-height: 1.2em;
      width: auto;
    }
  }
  .heading {
    display: inline-block;
    a {
      display: inline-block;
      text-transform: capitalize;
      font-weight: 450;
      color: ${(props) => props.theme.primary};

      &:hover {
        color: ${(props) => props.theme.green};
      }
    }
  }

  .bid {
    /* display: flex;
    flex-direction: column;
    align-items: start;
    align-items: center; */
    text-align: center;
    margin-bottom: var(--padding-4);
  }
  .bid__details {
    /* color: ${(props) => props.theme.secondary}; */
  }
  .bid__username {
    text-align: center;
    display: inline-block;
    padding-bottom: var(--padding-2);
    strong {
      text-transform: capitalize;
    }
    a:hover,
    a:focus {
      color: ${(props) => props.theme.green};
    }
  }
  .bid__price {
    display: inline-block;
    strong {
      font-size: var(--fontsizes-5);
    }
  }
  .bid--loading {
    /* align-items: start; */
    margin-bottom: 0;
  }
  .bid__username--loading {
    background-color: ${(props) => props.theme.gray3};
    width: 200px;
    height: 20px;
    border-radius: 20px;
  }
  .bid__price--loading {
    margin-top: var(--padding-2);
    background-color: ${(props) => props.theme.gray3};
    width: 150px;
    height: 20px;
    border-radius: 20px;
  }

  .buttons-container {
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 100%;
    & > :last-child {
      margin-top: 1rem;
    }
  }

  ${breakpoint("sm")} {
    &.bottom-buttons--row {
      flex-direction: row;

      .bid {
        text-align: start;
        margin-bottom: 0;
      }

      .current-bid {
        align-items: start;
        text-align: start;
      }
      .buttons-container {
        width: auto;
        margin-left: var(--padding-6);
      }
    }
    &.bottom-buttons--column {
      flex-direction: column;

      .bid {
        text-align: center;
      }

      .current-bid {
        align-items: center;
        text-align: center;
      }
      .buttons-container {
        width: 80%;
        & > :last-child {
          margin-top: 0;
          margin-left: 1rem;
        }
      }
    }
    & > :not(:first-of-type) {
      margin-bottom: 0;
    }
    /* flex-direction: row; */
    padding-left: 30px;
    padding-right: 30px;
    .current-bid {
      margin-right: 1rem;
      padding-bottom: 0;
    }
    .place-bid-button {
      width: max-content;
    }
    .buttons-container {
      flex-direction: row;
      width: auto;
      align-items: center;
      justify-content: center;
    }
  }
  ${breakpoint("lg")} {
    &.bottom-buttons--column {
      .buttons-container {
        width: 100%;
      }
    }
    .buttons-container {
      /* padding-left: 30px; */
      /* padding-right: 50px; */
    }
  }
`;

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await fetch(
    `${process.env.MORALIS_URL}/functions/getAllNFTDetails?_ApplicationId=${process.env.APP_ID}`
  );

  const res = await data.json();

  const paths = res.result.map((nft: any) => {
    const saleType = nft.nftData?.saleType || nft?.saleType;
    const type =
      saleType === "onAuction"
        ? "auction"
        : saleType === "onSale"
        ? "instantbuy"
        : "details";
    return {
      params: { id: nft.objectId, type },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const data = await fetch(
    `${process.env.MORALIS_URL}/functions/getSaleNFTinfo?_ApplicationId=${process.env.APP_ID}&Id=${context?.params?.id}`
  );
  try {
    const result = await data.json();
    const processed = await processNftDetails(result.result);
    return {
      props: {
        nft: processed,
        id: context?.params?.id,
      },
      revalidate: 5,
    };
  } catch (error: any) {
    return {
      props: {
        nft: {
          attributes: [],
          title: "",
          owner: {
            amount: 0,
            time: "",
            user: {
              username: "",
              name: "",
              profilePic: {
                url: "",
              },
            },
          },
          createdBy: {
            username: "",
            name: "",
            profilePic: {
              url: "",
            },
          },
          highestBidInETH: "",
          endTime: { iso: "" },
          amount: "",
          bids: [], //type
          description: "",
          history: [], // type
          amountInETH: "",
          id: "",
          likes: 0,
          userLiked: false,
          size: {
            width: 0,
            height: 0,
          },
          tags: [],
          mediaFormat: "image",
          minted: false,
          voucher: "",
          file: "",
          marketId: "",
          onSale: false,
          saleId: "",
          tokenId: "",
          tokenAddress: "",
          currency: "",
          nft_owner: "",
          royalties: 0,
          type: "",
          format: "",
          views: 0,
        },
        id: context?.params?.id,
      },
      revalidate: 5,
    };
  }
};
