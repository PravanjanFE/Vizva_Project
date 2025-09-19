import { useState } from "react";
import {
  MoralisCloudFunctionParameters,
  useMoralis,
  useMoralisCloudFunction,
} from "react-moralis";
import { vizvaMarketOption } from "config";
import { errorMsg } from "public/error";
import { bigint } from "zod";

interface InstantBuyOption {
  marketId: string;
  amount: string;
  tokenId: string;
  contractAddress: string;
}

interface RedeemNFTOptions {
  voucher: string;
  amount: string;
  creator: string;
}

interface TransferNFTOptions extends MoralisCloudFunctionParameters {
  Id: string;
  amount: string;
}

export function useInstantBuy() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { Moralis } = useMoralis();
  const [data, setData] = useState(null);

  async function execute(instantBuy: InstantBuyOption) {
    try {
      setLoading(true);
      const { marketId, amount, tokenId, contractAddress } = instantBuy;
      const buyAmount = (BigInt(amount) * BigInt(1025)) / BigInt(1000);
      const transaction = await Moralis.executeFunction({
        functionName: "buyItem",
        params: {
          _tokenAddress: contractAddress,
          _tokenId: tokenId,
          _id: parseInt(marketId),
        },
        msgValue: buyAmount.toString(),
        ...vizvaMarketOption,
      });

      //@ts-ignore
      const result = await transaction.wait();
      setData(result);
      setLoading(false);
      setError(null);
      return result;
    } catch (error: any) {
      console.error("buy error", error);
      var errMsg =
        error.message != "Internal JSON-RPC error."
          ? error.message
          : error.data?.message.includes("insufficient funds")
          ? "insufficient funds"
          : error.data.message;
      var message = errorMsg[errMsg] || "Something went wrong";
      setData(null);
      setLoading(false);
      setError(message);
      throw new Error(message);
    }
  }

  return {
    data,
    loading,
    error,
    execute,
  };
}

export function useRedeemNFT() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { Moralis } = useMoralis();
  const [data, setData] = useState(null);

  async function execute(redeemOptions: RedeemNFTOptions) {
    try {
      setLoading(true);
      const { voucher, amount, creator } = redeemOptions;
      const buyAmount = Math.ceil((parseInt(amount) * 1025) / 1000);
      const transaction = await Moralis.executeFunction({
        functionName: "redeem",
        params: {
          voucher,
          creator,
        },
        msgValue: buyAmount.toString(),
        ...vizvaMarketOption,
      });
      // @ts-ignore
      const result = await transaction.wait();
      setData(result);
      setLoading(false);
      setError(null);
    } catch (error: any) {
      console.error("redeem NFT failed", error);
      setData(null);
      setLoading(false);
      setError(
        error?.code?.toLowerCase().replaceAll("_", " ") ?? "redeem NFT failed"
      );
      throw new Error(
        error?.code?.toLowerCase().replaceAll("_", " ") ?? "redeem NFT failed"
      );
    }
  }

  return {
    data,
    loading,
    error,
    execute,
  };
}

export function useTransferNFTonSale() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { Moralis } = useMoralis();
  const [data, setData] = useState(false);

  const {
    fetch: processTransfer,
    isLoading: processTransferLoading,
    error: processTransferError,
    data: processTransferData,
  } = useMoralisCloudFunction("processInstantSale", {}, { autoFetch: false });

  async function execute(transfer: TransferNFTOptions) {
    try {
      setLoading(true);

      await processTransfer({
        params: transfer,
        onSuccess: () => {
          setData(true);
          setLoading(false);
          setError("false");
          // sessionStorage.setItem("artwork-bought", nft.id);
          // router.push(`/artwork/success/${nft.id}?price=${nft.amountInETH}`);
        },
        onError: (error) => {
          setData(false);
          setLoading(false);
          setError("error");
        },
      });
    } catch (error: any) {
      setData(false);
      setLoading(false);
      setError(
        error?.code?.toLowerCase().replaceAll("_", " ") ?? "transfer NFT failed"
      );
    }
  }

  return {
    data,
    loading,
    error,
    execute,
  };
}
