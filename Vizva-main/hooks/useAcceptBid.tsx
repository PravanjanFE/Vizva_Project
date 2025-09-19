import { useState } from "react";
import { useMoralis } from "react-moralis";
import { vizvaMarketOption } from "config";
import { ethers } from "ethers";
import { errorMsg } from "public/error";

export interface BidVoucher {
  signature: string;
  asset: string;
  tokenAddress: string;
  tokenId: string;
  marketId: number;
  bid: ethers.BigNumberish | string;
}

export function useAcceptBid() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const { Moralis } = useMoralis();

  async function execute(voucher: BidVoucher, _winner: string) {
    try {
      setLoading(true);
      const transaction = await Moralis.executeFunction({
        functionName: "finalizeBid",
        params: {
          voucher,
          _winner,
        },
        ...vizvaMarketOption,
      });

      //@ts-ignore
      const result = await transaction.wait();

      setData(result);
      setLoading(false);
      setError(null);
      return result;
    } catch (error: any) {
      console.error("useAcceptBid errored:", error);
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
