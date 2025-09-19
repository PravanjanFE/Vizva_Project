import { useState } from "react";
import { useMoralis } from "react-moralis";

interface voucherResult {
    tokenId: string;
    uri: string;
    minPrice: string;
    signature: string;
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
    collectionName?: string | "Vizva";
    ethAddress: string;
}

interface vizvaMarketOptions {
    nftId: string;
    saleType: "onSale" | "onAuction";
    bidInWei: string;
    marketId: string;
    txHash: string;
    time?: string;
}


export const sizeToObject = (sizeString: string) => {
    try {
        const sizeArray = sizeString.split(" x ");
        return {
            width: parseInt(sizeArray[0]),
            height: parseInt(sizeArray[1]),
        };
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const stringToTime = (stringTime: string) => {
    try {
        const timeArray = stringTime.split(" ");
        var newDate = new Date();
        if (timeArray[1] == "days") {
            newDate.setDate(newDate.getDate() + parseInt(timeArray[0]));
            return newDate;
        } else if (timeArray[1] == "week") {
            newDate.setDate(newDate.getDate() + parseInt(timeArray[0]) * 7);
            return newDate;
        } else if (timeArray[1] == "month") {
            newDate.setMonth(newDate.getMonth() + parseInt(timeArray[0]));
            return newDate;
        } else if (timeArray[1] == "year") {
            newDate.setFullYear(newDate.getFullYear() + parseInt(timeArray[0]));
            return newDate;
        } else {
            newDate.setDate(newDate.getDate() + 1);
            return newDate;
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

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
                collectionName,
                ethAddress
            } = options;
            const nftData = await Moralis.Cloud.run("createNewNFTDataByAdmin", {
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
                collectionName,
                ethAddress
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