import { useEffect, useState } from "react";
import {
  MoralisCloudFunctionParameters,
  useMoralisCloudFunction,
} from "react-moralis";
import processNftDetails from "services/processNft.service";
import { NFT } from "vizva";

export default function useNftDetails(
  functionName: string,
  params?: MoralisCloudFunctionParameters
) {
  const [artwork, setArtwork] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(true);
  const [nftError, setError] = useState<string | null>(null);
  const { isLoading, error, data, fetch } = useMoralisCloudFunction(
    functionName,
    params
  );

  async function prepareArtwork() {
    try {
      const result = await processNftDetails(data);
      setArtwork(result);
      setError(null);
      setLoading(false);
    } catch (err: any) {
      setError(err.message ?? "failed to process NFT");
      setArtwork(null);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    }
    if (error) {
      setError(error.message);
    }
    if (data === undefined) {
      setError("fetching nft defails failed");
      setLoading(false);
    }
    if (data) {
      prepareArtwork();
    }
  }, [data]);

  return {
    loading,
    data: artwork,
    error: nftError,
    fetch,
  };
}
