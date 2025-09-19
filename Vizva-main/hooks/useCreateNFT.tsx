import { useState } from "react";
import { useMoralis } from "react-moralis";
import { vizvaMarketOption, vizva721Option, lazyOption } from "config";
import LazyMinter from "../services/LazyMinter";
import { ethers } from "ethers";
import { sizeToObject, stringToTime } from "services/helpers";
import Moralis from "moralis-v1/types";

export interface LEVEL {
  key: string;
  value: string;
  total: string;
}

export interface PROPERTY {
  trait_type: string;
  value: string;
}

interface voucherResult {
  tokenId: string;
  uri: string;
  minPrice: string;
  signature: string;
}

interface UploadDataOptions {
  title: string;
  description: string;
  royalties: number;
  format: string;
  image: File;
  tags: string[];
  levels: LEVEL[];
  properties: PROPERTY[];
  stats: LEVEL[];
}

interface metadata {
  name: string;
  description: string;
  image: any;
  attributes: (
    | {
        key: string;
        value: string;
        total: string;
        type: string;
      }
    | {
        trait_type: string;
        value: string;
        type: string;
      }
  )[];
  royalties: number;
  format: string;
  tags: string[];
}

interface NFTDataOptions {
  size: string;
  tokenAddress: string;
  tokenId: string;
  tokenURI: string;
  metadata: metadata | undefined;
  minted: boolean;
  voucher: voucherResult | {};
  tags: Array<string>;
  digitalKey: string;
  txHash: string;
}

interface vizvaMarketOptions {
  nftId: string;
  saleType: "onSale" | "onAuction";
  bidInWei: string;
  marketId: string;
  txHash: string;
  time?: string;
}

export function useUploadMetadata() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<string>();
  const { Moralis } = useMoralis();

  async function execute(uploadData: UploadDataOptions) {
    try {
      setLoading(true);
      const {
        title,
        description,
        royalties,
        format,
        image,
        tags,
        levels,
        properties,
        stats,
      } = uploadData;
      const nftImage = new Moralis.File(`${title}.${format}`, image);
      await nftImage.saveIPFS();
      //@ts-ignore
      const nftImagePath = nftImage.ipfs();
      let attributes = [];
      if (levels.length > 0) {
        for (let i = 0; i < levels.length; i++) {
          attributes.push({ type: "levels", ...levels[i] });
        }
      }
      if (stats.length > 0) {
        for (let i = 0; i < stats.length; i++) {
          attributes.push({ type: "stats", ...stats[i] });
        }
      }
      if (properties.length > 0) {
        for (let i = 0; i < properties.length; i++) {
          attributes.push({ type: "properties", ...properties[i] });
        }
      }
      const metadata = {
        name: title,
        description,
        image: nftImagePath,
        attributes,
        royalties,
        format,
        tags,
      };
      const nftFileMetadataFile = new Moralis.File("metadata.json", {
        base64: btoa(unescape(encodeURIComponent(JSON.stringify(metadata)))),
      });
      await nftFileMetadataFile.saveIPFS();
      //@ts-ignore
      const nftFileMetadataFilePath = nftFileMetadataFile.ipfs();
      setData(nftFileMetadataFilePath);
      setError(undefined);
      setLoading(false);
      return { nftFileMetadataFilePath, metadata };
    } catch (error: any) {
      const e = JSON.parse(JSON.stringify(error));
      let message;
      if (e.code === 122) {
        message = "The title of your NFT contains invalid characters";
      } else {
        message = "Uploading metadata failed";
      }
      setData(undefined);
      setError(message);
      setLoading(false);
      throw new Error(message);
    }
  }

  return {
    loading,
    error,
    data,
    execute,
  };
}

export function useMintNFT() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Moralis.ExecuteFunctionResult | null>(null);
  const { Moralis } = useMoralis();

  async function execute(_uri: string = "") {
    try {
      setLoading(true);
      const tx = await Moralis.executeFunction({
        functionName: "createItem",
        params: {
          _uri,
        },
        ...vizva721Option,
      });
      setData(tx);
      setError(null);
      setLoading(false);
      return tx;
    } catch (error: any) {
      console.error("error minting nft", error);
      setData(null);
      setError("error in fetching metadata");
      setLoading(false);
      throw new Error("Minting nft failed");
    }
  }

  return {
    data,
    loading,
    error,
    execute,
  };
}

export function useEnsureMarketplaceApproval() {
  const [loading, setLoading] = useState(false);
  const [txPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(false);
  const { Moralis } = useMoralis();

  async function execute(contractAddress: string) {
    try {
      setLoading(true);
      const approvedForAll = await Moralis.executeFunction({
        functionName: "isApprovedForAll",
        params: {
          owner: Moralis.account,
          operator: vizvaMarketOption.contractAddress,
        },
        contractAddress,
        abi: vizva721Option.abi,
      });
      if (!approvedForAll) {
        const transaction = await Moralis.executeFunction({
          functionName: "setApprovalForAll",
          params: {
            operator: vizvaMarketOption.contractAddress,
            approved: true,
          },
          contractAddress,
          abi: vizva721Option.abi,
        });
        setPending(true);
        //@ts-ignore
        await transaction.wait();
        setPending(false);
      }
      setData(true);
      setError(null);
      setLoading(false);
    } catch (error: any) {
      console.error("failed getting approval", error);
      setData(false);
      setError("Approval denied");
      setLoading(false);
      throw new Error("Approval denied");
    }
  }

  return {
    data,
    loading,
    txPending,
    error,
    execute,
  };
}

export function useCreateMarketItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Moralis.ExecuteFunctionResult | null>(null);
  const { Moralis } = useMoralis();

  async function execute(
    saleType: number,
    id: string,
    price: string,
    royalty: number,
    contractAddress: string
  ) {
    try {
      setLoading(true);
      const tx = await Moralis.executeFunction({
        functionName: "addItemToMarket",
        params: {
          saleType,
          askingPrice: price,
          tokenData: {
            tokenType: 1,
            royalty,
            tokenId: id,
            amount: 1,
            tokenAddress: contractAddress,
            creator: Moralis.account,
          },
        },
        ...vizvaMarketOption,
      });
      setData(tx);
      setError(null);
      setLoading(false);
      return tx;
    } catch (error: any) {
      console.error("failed to create market item", error);
      setData(null);
      setError(error?.message || "failed to create market item");
      setLoading(false);
      throw new Error(error?.message || "failed to create market item");
    }
  }

  return {
    data,
    loading,
    error,
    execute,
  };
}

export function useCreateLazyVoucher() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<voucherResult | null>(null);
  const { Moralis, web3 } = useMoralis();

  const execute = async (
    tokenId: string,
    uri: string,
    minPrice: string = "0",
    royalty: number
  ) => {
    try {
      setLoading(true);
      const ethersProvider = web3;
      const signer = ethersProvider?.getSigner();
      let chainIdBN = await Moralis.executeFunction({
        functionName: "getChainID",
        ...vizvaMarketOption,
      });
      const chainInWei = Moralis.Units.FromWei(chainIdBN.toString());
      const chainId = ethers.utils.parseUnits(chainInWei.toString());
      const lazyMinter = new LazyMinter({
        contract: new ethers.Contract(
          vizvaMarketOption.contractAddress,
          vizvaMarketOption.abi,
          signer
        ),
        signer: signer as ethers.providers.JsonRpcSigner,
        chainId,
      });
      const voucher = await lazyMinter.createVoucher(
        lazyOption.contractAddress,
        tokenId,
        uri,
        minPrice,
        royalty
      );
      setData(voucher);
      setLoading(false);
      setError(null);
      return voucher;
    } catch (error: any) {
      console.error("failed to create lazy voucher", error);
      setData(null);
      setLoading(false);
      setError("failed to create lazy voucher");
    }
  };

  return {
    data,
    loading,
    error,
    execute,
  };
}

export function useSaveMarketData() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);
  const { Moralis } = useMoralis();

  const execute = async (options: vizvaMarketOptions) => {
    try {
      setLoading(true);
      let marketData;
      const { nftId, saleType, bidInWei, marketId, txHash, time } = options;
      if (saleType == "onAuction") {
        const auctionDataObject = {
          minBid: bidInWei,
          marketId,
          nftId: nftId,
          endTime: stringToTime(time as string),
          currency: "WMATIC",
          txHash
        };
        marketData = await Moralis.Cloud.run(
          "createAuctionData",
          auctionDataObject
        );
      } else {
        const saleDataObject = {
          price: bidInWei,
          marketId,
          nftId: nftId,
          currency: "MATIC",
          txHash
        };
        marketData = await Moralis.Cloud.run("createSaleData", saleDataObject);
      }
      setError(null);
      setLoading(false);
      setData(marketData);
      return marketData;
    } catch (error: any) {
      setError(error);
      setLoading(false);
      throw new Error(error.message ?? "Error saving market data");
    }
  };

  return {
    loading,
    error,
    data,
    execute,
  };
}

export function useSaveNFTData() {
  const [loading, setLoading] = useState<boolean>(false);
  const [marketError, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const { Moralis, user } = useMoralis();

  const execute = async (options: NFTDataOptions) => {
    try {
      setLoading(true);
      const {
        size,
        tokenAddress,
        tokenId,
        tokenURI,
        metadata,
        minted,
        voucher,
        tags,
        digitalKey,
        txHash,
      } = options;
      const nftData = await Moralis.Cloud.run("createNewNFTData", {
        size: sizeToObject(size),
        tokenAddress: tokenAddress.toLowerCase(),
        tokenId,
        tokenURI,
        metadata,
        minted,
        voucher,
        tags,
        digitalKey,
        txHash,
      });
      setData(nftData);
      setError(null);
      setLoading(false);
      return nftData;
    } catch (error: any) {
      setData(null);
      setError(marketError ? marketError : "Error updating market data");
      setLoading(false);
      throw new Error(
        marketError ?? error.message ?? "Error updating market data"
      );
    }
  };

  return {
    data,
    loading,
    error: marketError,
    execute,
  };
}
