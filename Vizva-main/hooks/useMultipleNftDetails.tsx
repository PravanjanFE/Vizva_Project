import { useEffect, useState } from "react";
import {
  MoralisCloudFunctionParameters,
  useMoralis,
  useMoralisCloudFunction,
  UseMoralisCloudFunctionOptions,
} from "react-moralis";
import processNftDetails from "services/processNft.service";
import { NFT } from "vizva";

export async function parseNFTs(data: any[]) {
  let nfts: NFT[] = [];
  try {
    for (let i = 0; i < data?.length ?? 0; i++) {
      const processedData = await processNftDetails(data[i]);
      nfts.push(processedData);
    }
  } catch (error) {
    console.error("ParseNFT error: ", error);
  } finally {
    return nfts;
  }
}

export default function useMultipleNftDetails(
  functionName: string,
  params?: MoralisCloudFunctionParameters,
  options?: UseMoralisCloudFunctionOptions
) {
  const { isInitialized } = useMoralis();

  const [artworks, setArtworks] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [nftError, setError] = useState<string | null>(null);
  const { isLoading, error, data, fetch, ...others } = useMoralisCloudFunction(
    functionName,
    params,
    options
  );

  async function prepareArtwork() {
    try {
      const nfts = await parseNFTs(data as any[]);
      setArtworks(nfts);
      setLoading(false);
    } catch (error: any) {
      console.error("prepareArtwork: ", error);
      setError(error.message ?? "failed to process the nfts");
      setArtworks([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoading && isInitialized) {
      setError(null);
      setArtworks([]);
      setLoading(true);
    }
    if (error && isInitialized) {
      setError(error.message);
      setArtworks([]);
      setLoading(false);
    }
    if (data && isInitialized) {
      setLoading(true);
      setError(null);
      (data as unknown[]).length > 0 ? prepareArtwork() : setLoading(false);
    }
    // else {
    //   if (!isInitialized) return;
    //   console.log("here 2", isLoading);
    //   setError(null);
    //   setArtworks([]);
    //   setLoading(isLoading);
    // }
    // return () => {
    //   console.log("clear");
    //   setArtworks([]);
    //   setLoading(true);
    //   setError(null);
    // };
  }, [data, isInitialized]);

  return {
    loading,
    data: artworks,
    error: nftError,
    fetch,
    ...others,
  };
}
