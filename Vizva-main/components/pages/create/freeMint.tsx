import styled from "@emotion/styled";
import React, { useContext, useEffect, useState } from "react";
import { CreateNftContext } from "context/createContext";
import { useMoralis, useNewMoralisObject } from "react-moralis";
import { useRouter } from "next/router";
import { customAlphabet } from "nanoid";
import Button from "components/button";
import Input from "components/input";
import {
  useUploadMetadata,
  useCreateLazyVoucher,
  useSaveNFTData,
  useSaveMarketData,
} from "hooks/useCreateNFT";
import { lazyOption } from "config";
import { Toggle } from "./mintNft";
import { breakpoint } from "public/breakpoint";
import LoadingAnimation from "components/animations/Loading";
import { useAppDispatch } from "redux/hook";
import { addNotification } from "redux/slice/notificationSlice";
/**
 * after clicking the create button, a modal is opened showing the steps taken in the
 * creation process. If the creation process is sucessful, an object is stored on sessionStorage
 * with key "sucess-created", the "createContext" value is cleared and the user is redirected
 * to the "create/success" page
 */

export default function LazyMinting() {
  const dispatch = useAppDispatch();
  const {
    data,
    updateData,
    type,
    clearStorage,
    incrementStage,
    setStageWithValue,
  } = useContext(CreateNftContext);
  const { Moralis } = useMoralis();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const nanoid = customAlphabet("1234567890", 64);

  const [price, setPrice] = useState(() => data.bid.toString());

  const {
    loading: uploadLoading,
    error: uploadError,
    execute: uploadExecute,
  } = useUploadMetadata();
  const {
    loading: lazyLoading,
    error: lazyError,
    execute: lazyVoucherExecute,
  } = useCreateLazyVoucher();

  const {
    data: setNFTData,
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
    title,
    description,
    royalties,
    type: mediaType,
    format,
    image,
    previewImage,
    size,
    bid,
    tags,
    levels,
    properties,
    stats,
    key,
    unlocked,
  } = data;
  const bidInWei = bid ? Moralis.Units.ETH(bid) : "0";

  // this indicate the step the code is in while creating the NFT
  const [createStep, setCreateStep] = useState(0);
  // when createStep is set to -1 it means the nft was saved/created sucessfully

  useEffect(() => {
    if (uploadError || lazyError || setNFTDataError) {
      dispatch(
        addNotification({
          type: "error",
          message:
            uploadError ??
            lazyError ??
            setNFTDataError ??
            "Something went wrong!",
        })
      );
    }
  }, [uploadError, setNFTDataError, lazyError]);

  useEffect(() => {
    if (!price) {
      updateData(0, "bid");
    }

    if (/^(\.[0-9]*)$|^([0-9]+(\.[0-9]*)?)$/gm.test(price)) {
      updateData(parseFloat(price), "bid");
    }
  }, [price]);

  const submitLazyMint = async () => {
    try {
      if (!title || !description || !royalties || !format || !image || !size) {
        throw new Error("Please fill all the fields");
      }
      if (bid <= 0) {
        throw new Error("Amount should be greater than 0");
      }
      setLoading(true);
      incrementStage();
      setCreateStep(1);
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
      //const metadataPath = "https://ipfs.io/ipfs/QmWagn5xLEqw79LaY7U8kzto9ibNVezEpQrJsEjnMaMfe8"
      const tokenId = nanoid();
      incrementStage();
      setCreateStep(2);
      const voucherResult = await lazyVoucherExecute(
        tokenId,
        uploadResult?.nftFileMetadataFilePath,
        bidInWei,
        royalties
      );
      if (voucherResult) {
        const t = await setNFTDataExecute({
          size,
          tokenAddress: lazyOption.contractAddress,
          tokenId: voucherResult?.tokenId,
          tokenURI: uploadResult?.nftFileMetadataFilePath,
          metadata: uploadResult?.metadata,
          minted: false,
          voucher: voucherResult,
          tags,
          digitalKey: unlocked ? key : "",
          txHash: "NA",
        });
        await saveMarketData({
          nftId: t.id,
          saleType: "onSale",
          bidInWei,
          marketId: "NA",
          txHash: "NA",
        });
        // dispatch(
        //   addNotification({
        //     type: "success",
        //     message: `Voucher created for ${voucherResult.tokenId}`,
        //   })
        // );
        sessionStorage.setItem("success-created", t.id);
        // clearStorage();
        router.replace(`/create/success/${t.id}`);
      } else {
        setCreateStep(0);
        throw new Error("Can't create NFT");
      }
    } catch (error: any) {
      setCreateStep(0);
      setLoading(false);
      setStageWithValue(5); // stay on the mint stage if any error occurs
      dispatch(addNotification({ type: "error", message: "an error occured" }));
    }
  };
  const minAmount = 0.005;

  return (
    <div className="container">
      <StyledContainer>
        {createStep <= 0 ? (
          <>
            <h1>pricing details</h1>
            <Input
              type="text"
              label="sale price"
              id="sale-price"
              placeholder="fixed sale price"
              value={price}
              error={
                price
                  ? !/^(\.[0-9]*)$|^([0-9]+(\.[0-9]*)?)$/gm.test(price) ||
                    (bid > 0 && bid < minAmount)
                  : false
              }
              errorText={
                bid < minAmount
                  ? `Your price is less than ${minAmount}`
                  : "invalid input"
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPrice(e.target.value)
              }
            />

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
              placeholder="Digital key, code to redeem or link to a file"
              value={data.key}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateData(e.target.value, "key")
              }
            />

            <div className="button-row">
              <Button
                text="Create"
                loading={loading}
                onClick={() => submitLazyMint()}
                disabled={data.bid < minAmount}
              />
            </div>
          </>
        ) : (
          <StyledDiv>
            {createStep === 1 ? (
              <div>
                <p className="heading">Creating Metadata URI</p>
                <p>saving metadata with IPFS</p>
              </div>
            ) : (
              <div>
                <p className="heading">Creating Lazy Voucher</p>
                <p>
                  Accept the signature request in your wallet. This will create
                  a voucher for minting your NFT. This process doesn't required
                  any gas fee.
                </p>
              </div>
            )}
            <div className="bottom">
              <LoadingAnimation className="loading" />
              <p>Waiting for initialization...</p>
            </div>
          </StyledDiv>
        )}
      </StyledContainer>
    </div>
  );
}

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  & > :not(:last-child) {
    margin: 0 0 var(--padding-8) 0;
  }
  h1 {
    text-transform: capitalize;
    text-align: center;
    margin-bottom: 1.3rem;
  }
  .spacer {
    margin-top: 1rem;
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
      }
    }
  }
  .button-row {
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

const StyledDiv = styled.div`
  max-width: 700px;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: max-content 1fr;

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
