import styled from "@emotion/styled";
import { Switch } from "@headlessui/react";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { CreateNftContext, TIME } from "context/createContext";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import {
  useUploadMetadata,
  useMintNFT,
  useEnsureMarketplaceApproval,
  useCreateMarketItem,
  useSaveMarketData,
  useSaveNFTData,
} from "hooks/useCreateNFT";
import Button from "components/button";
import Input from "components/input";
import { vizva721Option } from "config";
import { breakpoint } from "public/breakpoint";
import LoadingAnimation from "components/animations/Loading";
import { useAppDispatch } from "redux/hook";
import { addNotification } from "redux/slice/notificationSlice";
import Loading from "components/loading";
import ServiceFee from "./serviceFee";
export default function MintNFT() {
  const dispatch = useAppDispatch();
  const [createStep, setCreateStep] = useState(0);
  const [selection, setSelection] = useState(2);
  const [mintPending, setMintPending] = useState(false);
  const [createMarketPending, setCreateMarketPending] = useState(false);

  const { isAuthenticated, Moralis, isWeb3Enabled, isWeb3EnableLoading } =
    useMoralis();
  const { data, updateData, clearStorage, incrementStage, setStageWithValue } =
    useContext(CreateNftContext);

  const {
    loading: uploadLoading,
    error: uploadError,
    execute: uploadExecute,
  } = useUploadMetadata();

  const {
    loading: mintLoading,
    error: mintError,
    execute: mintExecute,
  } = useMintNFT();

  const {
    loading: approveLoading,
    txPending: approvePending,
    error: approveError,
    execute: approveExecute,
  } = useEnsureMarketplaceApproval();

  const {
    loading: createMarketLoading,
    error: createMarketError,
    execute: createMarketExecute,
  } = useCreateMarketItem();

  const {
    loading: setNFTDataLoading,
    error: setNFTDataError,
    execute: setNFTDataExecute,
  } = useSaveNFTData();

  const {
    loading: saveMarketLoading,
    error: saveMarketDataError,
    execute: saveMarketData,
  } = useSaveMarketData();

  const {
    bid,
    title,
    description,
    royalties,
    format,
    image,
    size,
    tags,
    type: mediaType,
    previewImage,
    time,
    properties,
    levels,
    stats,
    unlocked,
    key,
  } = data;
  const [price, setPrice] = useState(() => data.bid.toString());

  const bidInWei = Moralis.Units.ETH(bid);

  useEffect(() => {
    if (
      uploadError ||
      mintError ||
      approveError ||
      createMarketError ||
      setNFTDataError
    ) {
      console.error(
        uploadError ||
          mintError ||
          approveError ||
          createMarketError ||
          setNFTDataError
      );
    }
  }, [
    uploadError,
    mintError,
    approveError,
    createMarketError,
    setNFTDataError,
  ]);

  useEffect(() => {
    if (!price) {
      updateData(0, "bid");
    }

    if (parseFloat(price) ? true : false) {
      updateData(parseFloat(price), "bid");
    }
  }, [price]);

  const [onLoading, setOnLoading] = useState(false);
  const router = useRouter();
  const minAmount = 0.005;
  const priceText = selection == 2 ? "bid" : "price";

  const submitNft = async () => {
    try {
      if (!title || !description || !royalties || !format || !image || !size) {
        throw new Error("Please fill all the fields");
      }
      if (bid <= 0) throw new Error("Amount should be greater than 0");
      if (!isAuthenticated) throw new Error("Please login to continue");
      if (!isWeb3Enabled && !isWeb3EnableLoading)
        throw new Error("No web3 found :(");
      setOnLoading(true);
      setCreateStep(1);
      incrementStage();

      const metadata = {
        title,
        description,
        royalties,
        format,
        image,
        tags,
        // the last element in these arrays are always empty
        // levels: levels.slice(0, -1),
        // properties: properties.slice(0, -1),
        // stats: stats.slice(0, -1),
        levels: levels.filter(
          (level) => level.key && level.total && level.value
        ),
        properties: properties.filter(
          (property) => property.trait_type && property.value
        ),
        stats: stats.filter((stat) => stat.key && stat.total && stat.value),
      };
      const uploadResult = await uploadExecute(metadata);
      //for testing purpose
      //const metaDataPath = "https://ipfs.moralis.io:2053/ipfs/Qmd9Gie9tmi9VbCfreFnjYk5cdHZPdyk8p8U3t5gYp2Mo9"
      incrementStage();
      setCreateStep(2);

      const tx1 = await mintExecute(uploadResult?.nftFileMetadataFilePath);
      setMintPending(true);
      const savedNFT = await setNFTDataExecute({
        size,
        tokenAddress: vizva721Option.contractAddress,
        tokenId: "",
        tokenURI: uploadResult?.nftFileMetadataFilePath,
        metadata: uploadResult?.metadata,
        minted: true,
        voucher: {},
        tags,
        digitalKey: unlocked ? key : "",
        txHash: tx1.hash,
      });
      // @ts-ignore
      const mint = await tx1.wait();
      setMintPending(false);
      const tokenIdString = mint.events[0].args["tokenId"]; // this value is BigNumber
      const tokenId = parseInt(tokenIdString).toString();
      incrementStage();
      setCreateStep(3);
      await approveExecute(vizva721Option.contractAddress);
      incrementStage();
      setCreateStep(4);
      const tx2 = await createMarketExecute(
        selection,
        tokenId,
        bidInWei,
        royalties,
        vizva721Option.contractAddress
      );
      setCreateMarketPending(true);
      await saveMarketData({
        nftId: savedNFT.id,
        saleType: selection == 2 ? "onAuction" : "onSale",
        bidInWei,
        marketId: "",
        time,
        txHash: tx2.hash,
      });
      // @ts-ignore
      const marketTxReceipt = await tx2.wait();
      setCreateMarketPending(false);
      // const itemAdded = marketTxReceipt.events.find(
      //   (obj: any) => obj.event == "itemAdded"
      // );
      // const { id: marketIdBN } = itemAdded.args;
      // const marketId = parseInt(marketIdBN).toString();
      // dispatch(
      //   addNotification({
      //     type: "success",
      //     message: `${data.title} added to Market`,
      //   })
      // );
      //  this will be checked with the artwork on success page
      sessionStorage.setItem("success-created", savedNFT.id);
      // clearStorage();
      router.replace(`/create/success/${savedNFT.id}`);
    } catch (error: any) {
      setCreateStep(0);
      setStageWithValue(5); // stay on the mint stage if any error occurs
      setOnLoading(false);
      dispatch(
        addNotification({
          type: "error",
          message: error.message ?? "Something went wrong!",
        })
      );
      console.error(error);
    }
  };

  return (
    <div className="container">
      <StyledContainer>
        {createStep <= 0 && (
          <>
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
                  selection == 2 ? "minimum bid amount" : "fixed sale price"
                }
                infoText={`${
                  selection == 2
                    ? "Bids below this amount won’t be allowed."
                    : ""
                } Minimum ${priceText} is ${minAmount} MATIC`}
                error={
                  price
                    ? !/^(\.[0-9]*)$|^([0-9]+(\.[0-9]*)?)$/gm.test(price) ||
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
                value={price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPrice(e.target.value)
                }
              />
              <ServiceFee fee={data.bid} />
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
                  <p>Content will be unlocked after successful transaction</p>
                </div>
                <Toggle />
              </div>
              <Input
                placeholder="Digital key, code to redeem or link to a file..."
                value={data.key}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateData(e.target.value, "key")
                }
              />
            </div>
            {/* if put on auction */}
            {selection == 2 && (
              <p>
                Any bid placed in the last 10 minutes extends the auction by 10
                minutes.
              </p>
            )}
            <div className="buttons-row">
              <Button
                text="Create NFT"
                loading={onLoading}
                onClick={() => submitNft()}
                disabled={
                  selection === 2 ? bid < minAmount || !time : bid < minAmount
                }
              />
            </div>
          </>
        )}
        {createStep > 0 && (
          <>
            <StyledDiv>
              {/* <div> */}
              {createStep === 1 && (
                <div>
                  <p className="heading">Creating Metadata URI</p>
                  <p>saving metadata with IPFS</p>
                </div>
              )}

              {createStep === 2 && (
                <div>
                  <p className="heading">Token Creation</p>
                  <p>minting your NFT</p>
                </div>
              )}

              {createStep === 3 && (
                <div>
                  <p className="heading">
                    Getting Approval for NFT Transaction
                  </p>
                  <p>
                    you have allow marketplace to transfer your NFT. This is a
                    one time process
                  </p>
                </div>
              )}

              {createStep === 4 && (
                <div>
                  <p className="heading">Listing your NFT on Vizva</p>
                  <p>putting your NFT for sale</p>
                </div>
              )}

              <div className="bottom">
                <LoadingAnimation className="loading" />
                {((!mintPending && mintLoading) ||
                  (!approvePending && approveLoading) ||
                  (!createMarketPending && createMarketLoading)) && (
                  <p>Please Confirm transaction from your wallet</p>
                )}
                {(mintPending || approvePending || createMarketPending) && (
                  <p>Waiting for Confirmation...</p>
                )}
              </div>
              {/* </div> */}
            </StyledDiv>
          </>
        )}
      </StyledContainer>
    </div>
  );
}

export function Toggle() {
  const { data, updateData } = useContext(CreateNftContext);
  const [unlocked, setUnlocked] = useState(data.unlocked);
  useEffect(() => {
    updateData(unlocked, "unlocked");
  }, [unlocked]);
  return (
    <Switch as={Fragment} checked={unlocked} onChange={setUnlocked}>
      <StyledToggle $checked={unlocked}>
        <div className={`${unlocked ? undefined : "active"} no`}>No</div>
        <div className={`${unlocked ? "active" : undefined} yes`}>Yes</div>
        <div className={`${unlocked ? "unlocked" : "locked"} bg`}></div>
      </StyledToggle>
    </Switch>
  );
}

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  /* height: 100%; */
  max-width: 700px;
  margin: 0 auto;
  padding-bottom: var(--padding-3);
  display: flex;
  flex-direction: column;

  & > :not(:last-child) {
    margin: 0 0 var(--padding-8) 0;
  }

  & > p {
    font-weight: 500;
    line-height: 1.3em;
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
    margin: var(--padding-7) auto var(--padding-8) auto;
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
        line-height: 1.3em;
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
`;

const StyledToggle = styled.div<{ $checked: boolean }>`
  width: 100px;
  min-width: 100px;
  height: 45px;
  border: 1px solid
    ${(props) => (props.$checked ? props.theme.green : props.theme.gray2)};
  background-color: transparent;
  outline: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  div {
    height: 100%;
    width: 50%;
    font-size: var(--fontsizes-3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 250ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  .yes {
    color: ${(props) => props.theme.gray3};
    &.active {
      color: ${(props) => props.theme.background};
    }
  }
  .no {
    color: ${(props) => props.theme.gray3};
    &.active {
      color: ${(props) => props.theme.background};
    }
  }
  .bg {
    position: absolute;
    /* transition: all 250ms cubic-bezier(0.68, -0.55, 0.265, 1.55); */
    z-index: -1;
    &.locked {
      transform: translateX(0);
      background-color: ${(props) => props.theme.gray2};
    }
    &.unlocked {
      transform: translateX(100%);
      background-color: ${(props) => props.theme.green};
    }
  }
`;

const StyledDiv = styled.div`
  max-width: 700px;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: max-content 1fr;
  padding-bottom: var(--padding-6);
  height: 100%;

  div {
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
`;
