import styled from "@emotion/styled";
import LoadingAnimation from "components/animations/Loading";
import Button from "components/button";
import LeftArrow from "components/icons/left arrow";
import RightArrow from "components/icons/right arrow";
import Input from "components/input";
import MaxWidth from "components/layout/maxWidth";
import Navbar from "components/navigation/navbar";
import { Toggle } from "components/pages/create/mintNft";
import ServiceFee from "components/pages/create/serviceFee";
import { TIME } from "context/createContext";
import {
  useCreateMarketItem,
  useEnsureMarketplaceApproval,
  useSaveMarketData,
} from "hooks/useCreateNFT";
import useNftDetails from "hooks/useNftDetails";
import { addNotification } from "redux/slice/notificationSlice";
import { GetServerSideProps } from "next";
import { CreateButton } from "pages/create";
import { breakpoint } from "public/breakpoint";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Prompt from "components/prompt";
import Loading from "components/loading";

const initial = {
  bid: 0,
  time: TIME[0],
  key: "",
};

export default function Resell({ id }: { id: string }) {
  const {
    data: nft,
    loading,
    error,
  } = useNftDetails("getSaleNFTinfo", { Id: id });

  const dispatch = useDispatch();
  const router = useRouter();
  const { user, Moralis, isInitializing, isAuthenticating } = useMoralis();
  const [stage, setStage] = useState(1);
  const [selection, setSelection] = useState(2);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const minAmount = 0.005;
  const priceText = selection == 2 ? "bid" : "price";
  const [data, setData] = useState(initial);
  const [isSparkOpen, setIsSparkOpen] = useState(false);
  const [createMarketPending, setCreateMarketPending] = useState(false);

  const createSteps = 5;

  const {
    loading: createMarketLoading,
    error: createMarketError,
    execute: createMarketExecute,
  } = useCreateMarketItem();

  const {
    loading: saveMarketLoading,
    error: saveMarketDataError,
    execute: saveMarketData,
  } = useSaveMarketData();

  const {
    loading: approveLoading,
    error: approveError,
    txPending: approvePending,
    execute: approveExecute,
  } = useEnsureMarketplaceApproval();

  useEffect(() => {
    // const delay = stage === 1 ? 150 : 0;
    // async function getWidth() {
    //   setTimeout(() => {
    //     setProgressBarWidth((100 / createSteps) * stage);
    //   }, delay);
    // }
    // getWidth();
    setProgressBarWidth((100 / createSteps) * stage);

    const t1 = setTimeout(() => {
      setIsSparkOpen(true);
    }, 200);

    // const t2 = setTimeout(() => {
    // }, 150);

    const t3 = setTimeout(() => {
      setIsSparkOpen(false);
    }, 800);
    return () => {
      clearTimeout(t1);
      // clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [stage]);

  useEffect(() => {
    if (approveError || saveMarketDataError || createMarketError) {
      setStage(1);
      console.error(approveError || saveMarketDataError || createMarketError);
    }
  }, [approveError, saveMarketDataError, createMarketError]);

  useEffect(() => {
    if (approveLoading) setStage(2);
    if (createMarketLoading) setStage(4);
    if (saveMarketLoading) setStage(5);
  }, [approveLoading, createMarketLoading, saveMarketLoading]);

  async function submitNft() {
    try {
      await approveExecute(nft?.tokenAddress as string);
      const tx = await createMarketExecute(
        selection,
        nft?.tokenId as string,
        Moralis.Units.ETH(data.bid),
        nft?.royalties as number,
        nft?.tokenAddress as string
      );
      setCreateMarketPending(true);
      await saveMarketData({
        nftId: nft?.id as string,
        saleType: selection == 2 ? "onAuction" : "onSale",
        bidInWei: Moralis.Units.ETH(data.bid),
        marketId: "",
        time: data.time,
        txHash: tx.hash,
      });
      // @ts-ignore
      const marketTxReceipt = await tx.wait();
      // const itemAdded = marketTxReceipt.events.find(
      //   (obj: any) => obj.event == "itemAdded"
      // );
      // const { id: marketIdBN } = itemAdded.args;
      // const marketId = parseInt(marketIdBN).toString();

      dispatch(
        addNotification({
          type: "success",
          message: `${nft?.title} added to Market`,
        })
      );
      //  this will be checked with the artwork on success page
      sessionStorage.setItem("success-created", nft?.id as string);
      // clearStorage();
      router.replace(`/create/success/${nft?.id}`);
    } catch (error) {
      setStage(1);
      dispatch(
        addNotification({
          type: "error",
          message: `Failed to add ${nft?.title} to market`,
        })
      );
    }
  }
  const updateData = (value: any, header: string) => {
    setData((d: typeof initial) => ({ ...d, [header]: value }));
  };
  const { bid, time, key } = data;
  return (
    <>
      <head>
        <title>Put on Marketplace</title>
      </head>
      <Navbar />
      <StyledDiv>
        {isInitializing || isAuthenticating || loading ? (
          <Loading isOpen={isInitializing || isAuthenticating || loading} />
        ) : nft ? (
          <StyledContainer>
            <div className="progress-wrapper">
              <div className="progress">
                {/*@ts-ignore*/}
                {
                  <CreateButton
                    onClick={() => {}}
                    disabled={true}
                    className="create-btn"
                  >
                    <LeftArrow />
                  </CreateButton>
                }
                <div className="progress__track">
                  <div
                    className="progress__bar"
                    style={{ width: `${progressBarWidth}%` }}
                  ></div>
                  {isSparkOpen && (
                    <img
                      src="/animations/Spark.gif"
                      alt="spark"
                      style={{
                        transform: `translateX(-50%)`,
                        height: "80px",
                        width: "80px",
                      }}
                    />
                  )}
                </div>
                {/*@ts-ignore*/}
                {
                  <CreateButton
                    onClick={() => {}}
                    disabled={true}
                    className="create-btn"
                  >
                    <RightArrow />
                  </CreateButton>
                }
              </div>
            </div>
            {stage === 1 && (
              <>
                <div className="container">
                  <h1>pricing details</h1>
                  {/* toggle buttons */}
                  <div className="selector">
                    <button
                      className={selection == 2 ? "active" : "disabled"}
                      onClick={() => {
                        setSelection(2);
                      }}
                    >
                      Put on auction
                    </button>
                    <button
                      className={selection == 1 ? "active" : "disabled"}
                      onClick={() => setSelection(1)}
                    >
                      Instant Sale
                    </button>
                  </div>
                  <div>
                    <Input
                      type="text"
                      label={selection == 2 ? "minimum bid" : "sale price"}
                      id={selection == 2 ? "bid" : "sale-price"}
                      placeholder={
                        selection == 2
                          ? "minimum bid amount"
                          : "fixed sale price"
                      }
                      infoText={`${
                        selection == 2
                          ? "Bids below this amount won’t be allowed."
                          : ""
                      } Minimum ${priceText} is ${minAmount} MATIC`}
                      error={
                        data.bid
                          ? !/^(\.[0-9]*)$|^([0-9]+(\.[0-9]*)?)$/gm.test(
                              data.bid.toString()
                            ) ||
                            (bid > 0 && bid < minAmount)
                          : false
                      }
                      errorText={
                        bid < minAmount
                          ? `your ${priceText} is lower than ${minAmount}`
                          : "invalid input"
                      }
                      // error={
                      //   parseFloat(price) ? false : true
                      //   !/^(\.[0-9]*)$|^([0-9]+(\.[0-9]*)?)$/gm.test(price) ||
                      //   parseFloat(price) === 0
                      // }
                      // errorText={"invalid input"}
                      value={data.bid}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateData(e.target.value, "bid")
                      }
                    />
                    <ServiceFee fee={bid} />
                  </div>
                  {/* if put on auction */}
                  {selection == 2 && (
                    <div className="select">
                      <label htmlFor="time">auction ends in</label>
                      <select
                        name="time"
                        id="time"
                        onChange={(e) => updateData(e.target.value, "time")}
                        value={data.time}
                      >
                        <option disabled>pick an option</option>
                        {TIME.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <div className="unlock-content">
                      <div className="left">
                        <p>Unlock once purchased</p>
                        <span>
                          Content will be unlocked after successful transaction
                        </span>
                      </div>
                      <Toggle />
                    </div>
                    <Input
                      placeholder="Digital key, code to redeem or link to a file..."
                      value={key}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateData(e.target.value, "key")
                      }
                    />
                  </div>
                  {/* if put on auction */}
                  {selection == 2 && (
                    <p>
                      Any bid placed in the last 10 minutes extends the auction
                      by 10 minutes.
                    </p>
                  )}
                  <div className="buttons-row">
                    <Button
                      text="Create Order"
                      loading={createMarketLoading || saveMarketLoading}
                      onClick={() => submitNft()}
                      disabled={
                        selection === 2
                          ? bid < minAmount || !time
                          : bid < minAmount
                      }
                    />
                  </div>
                </div>
              </>
            )}
            {stage > 1 && (
              <div className="minting">
                {stage === 2 && (
                  <div>
                    <p className="heading">
                      Checking Approval for NFT Transaction
                    </p>
                    <p>
                      you have allow marketplace to transfer you NFT. This is a
                      one time process
                    </p>
                  </div>
                )}

                {stage === 4 && (
                  <div>
                    <p className="heading">Listing your NFT on Vizva</p>
                    <p>putting your NFT for sale</p>
                  </div>
                )}

                {stage === 5 && (
                  <div>
                    <p className="heading">Finalizing Sale</p>
                    <p>Saving to vizva</p>
                  </div>
                )}
                <div className="bottom">
                  <LoadingAnimation className="loading" />
                  {(createMarketPending || approvePending) && (
                    <p>
                      Waiting for Confirmation...Please don't refresh or close
                      this page{" "}
                    </p>
                  )}
                  {((!createMarketPending && createMarketLoading) ||
                    (!approvePending && approveLoading)) && (
                    <p>Please Confirm transaction from your wallet </p>
                  )}
                </div>
              </div>
            )}
          </StyledContainer>
        ) : (
          <Prompt
            closeable={false}
            title="Fetching error"
            message="The server didn't return any NFT details"
            text="Home"
            href="/"
          />
        )}
      </StyledDiv>
    </>
  );
}

const StyledContainer = styled.div`
  max-height: calc(100vh - 100px);
  position: sticky;
  top: 100px;
  overflow: auto;
  padding: 0 var(--padding-6);

  .progress-wrapper {
    width: 100%;
    z-index: 1;
    background: ${(props) => props.theme.background};
    height: 80px;
    position: sticky;
    top: 0;
  }
  .progress {
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
    display: grid;
    grid-gap: 1rem;
    align-items: center;
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
    grid-template-columns: max-content 1fr max-content;

    .create-btn {
      display: flex;
    }

    .sparks {
      /* display: none; */
    }

    .spark {
      display: none;
      font-family: sans-serif;
      svg {
        font-family: sans-serif;
      }
    }
  }
  .progress__track {
    width: 100%;
    height: 10px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: start;
    margin: 0 auto;
    background-color: rgba(199, 199, 199, 0.16);
    position: relative;
  }
  .progress__bar {
    width: 0;
    height: 10px;
    display: block;
    border-radius: 10px;
    background-image: ${(props) => props.theme.gradient};
    transition: width 800ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
    /* transition: width 500ms cubic-bezier(0.22, 1, 0.36, 1); */
    /* transition: width 150ms ease 1s; */
  }
  .container {
    padding-bottom: var(--padding-4);
    display: flex;
    flex-direction: column;
    max-width: 700px;
    margin: 0 auto;
    h1 {
      text-transform: capitalize;
      font-size: var(--fontsizes-6);
      text-align: center;
      /* margin-bottom: 1rem; */
    }
    & > :not(:last-child) {
      margin: 0 0 var(--padding-8) 0;
    }
    & > p {
      font-weight: 500;
    }
    .select {
      & > label {
        /* padding-top: 1rem; */
        text-transform: capitalize;
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      & > select {
        width: 100%;
        height: 50px;
        background: ${(props) => props.theme.formBackground};
        color: ${(props) => props.theme.primary};
        font-size: var(--fontsizes-2);
        outline: none;
        border: none;
        padding: 0 20px;
        border-radius: 0.2rem;

        &:focus {
          outline: 2px solid ${(props) => props.theme.green};
        }
      }
    }
    .selector {
      display: flex;
      justify-content: center;
      margin: var(--padding-5) auto var(--padding-8) auto;
      button {
        outline: none;
        border: none;
        /* font-size: var(--fontsizes-1); */
        background: transparent;
        color: ${(props) => props.theme.gray3};
        font-weight: 500;
        border-bottom: 2px solid transparent;
        padding-bottom: var(--padding-1);
        min-width: 150px;
        cursor: pointer;
        &:first-of-type {
          margin-right: var(--padding-5);
        }
        &.active {
          color: ${(props) => props.theme.primary};
          border-color: ${(props) => props.theme.primary};
        }
        &:hover,
        &:focus {
          color: ${(props) => props.theme.primary};
        }
      }
    }

    .auction-ends-in {
      width: 100%;
    }
    .unlock-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--padding-5);
      .left {
        margin-right: 1rem;
        p {
          font-weight: 500;
        }
        span {
          display: block;
          font-weight: 500;
          /* max-width: 18ch; */
          /* color: ${(props) => props.theme.secondary}; */
          /* font-size: var(--fontsizes-1); */
        }
      }
    }
    .buttons-row {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2rem;
    }

    ${breakpoint("sm")} {
      .selector > button {
        font-size: var(--fontsizes-2);
      }
    }
  }
  .minting {
    /* max-width: 700px;
    width: 100%;
    height: 100%;
    */
    display: grid;
    grid-template-rows: max-content 1fr;
    padding-bottom: var(--padding-6);
    height: calc(100vh - 100px - 80px);
    p {
      text-align: center;
      max-width: 40ch;
      margin: 0 auto;
    }

    & > p.heading {
      font-weight: 500;
      font-size: var(--fontsizes-5);
    }

    p:last-of-type {
      color: ${(props) => props.theme.gray2};
      padding-top: var(--padding-2);
    }
    .bottom {
      align-self: center;
      .loading {
        max-width: 200px;
        margin: 0 auto;
      }
      & > p {
        margin: 0 auto;
        width: max-content;
      }
    }
  }
  ${breakpoint("lg")} {
    .minting {
      padding-top: var(--padding-7);

      p.heading {
        font-size: var(--fontsizes-7);
      }
    }
  }
`;
const StyledDiv = styled.div``;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      id: context?.params?.id,
    },
  };
};
