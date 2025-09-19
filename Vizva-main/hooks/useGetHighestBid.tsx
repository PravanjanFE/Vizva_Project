import { useEffect, useState } from "react";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { User } from "vizva";

interface HighestBid {
  bidder: User;
  signedVoucher: {
    asset: string;
    marketId: string;
    signature: string;
    tokenAddress: string;
    tokenId: string;
    bid: string;
  };
  objectId: string;
}

const defaultProps = {
  currency: "MATIC",
  bidder: { username: "", bid: "", ethAddress: "" },
  signedVoucher: {
    asset: "",
    marketId: 0,
    signature: "",
    tokenAddress: "",
    tokenId: "",
    bid: "0",
  },
  objectId: "",
};

export default function useGetHighestBid(saleId: string) {
  const { Moralis } = useMoralis();
  const [result, setResult] = useState<typeof defaultProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    data,
    isLoading,
    error: bidError,
  } = useMoralisCloudFunction("getHighestBid", {
    auctionId: saleId,
  });

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      setResult(null);
      setError(null);
    }
    if (data) {
      const { bidder, signedVoucher, objectId }: HighestBid = JSON.parse(
        JSON.stringify(data)
      );
      setResult({
        currency: "MATIC",
        bidder: {
          username: bidder.username,
          // name,
          bid: Moralis.Units.FromWei(signedVoucher.bid),
          ethAddress: bidder.ethAddress,
        },
        signedVoucher: {
          ...signedVoucher,
          marketId: parseInt(signedVoucher.marketId),
        },
        objectId,
      });
      setError(null);
      setLoading(false);
    }
    if (bidError) {
      setError(bidError.message);
      setResult(null);
      setLoading(false);
    }
    // if no data is returned
    if (!isLoading && !data) {
      setLoading(false);
      setResult(null);
    }
  }, [data, saleId, isLoading, bidError]);

  return {
    data: result,
    loading,
    error,
  };
}
