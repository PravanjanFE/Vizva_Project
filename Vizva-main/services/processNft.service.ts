import Moralis from "moralis-v1";
import { types } from "pages/artwork/[id]";
import { NFT } from "vizva";

export default async function processNftDetails(nft: any): Promise<NFT> {
  // the structure of data returned when querying from profile page is quite different
  const dataObject = JSON.parse(JSON.stringify(nft));
  const {
    objectId,
    history: unprocessedHistory,
    marketId: unprocessedMarketId,
    currency: unprocessedCurrency,
    nftData,
    ...others2
  } = dataObject;

  let history: any[] = [];
  if (unprocessedHistory && unprocessedHistory.length > 0) {
    history = await processHistoryData(unprocessedHistory);
  }

  let owner: any;
  let creator: any;
  let reversedHistory: any[] = [];

  // REVERSE THE HISTORY, SO THAT THE LATEST TRANSACTION IS AT THE TOP
  //  GET THE OWNER AND CREATOR
  history.reverse().forEach((history) => {
    reversedHistory.push(history);
    if (
      (history.type === "NFTPurchase" || history.type === "auctionWon") &&
      !owner
    ) {
      owner = history;
    }
    if (history.type === "minted") {
      creator = history;
    }
  });

  const amount = dataObject.price ?? dataObject.minBid ?? 0;
  const amountInETH = Moralis.Units.FromWei(amount.toString());
  const highestBid = dataObject.hasOwnProperty("highestBid")
    ? dataObject.highestBid == 0
      ? amount
      : dataObject.highestBid.toString()
    : "0";
  const highestBidInETH = Moralis.Units.FromWei(highestBid.toString());
  const saleType = nftData?.saleType || dataObject.saleType;
  const type =
    saleType === "onAuction"
      ? "auction"
      : saleType === "onSale"
      ? "instantbuy"
      : "details";
  const marketId = unprocessedMarketId || null;
  const currency = unprocessedCurrency || "MATIC";
  // const metaDatagateWay = nftData?.tokenURI || dataObject.tokenURI;

  const returned = {
    id: nftData?.objectId || dataObject.objectId,
    saleId: nftData?.dataObject || dataObject.objectId || null,
    amount,
    amountInETH,
    marketId,
    type,
    owner: owner ? owner : null,
    highestBid,
    highestBidInETH,
    currency,
    history: reversedHistory,
    ...others2,
    createdBy: creator
      ? creator.user
      : nftData?.createdBy
      ? nftData.createdBy
      : dataObject.createdBy,
  };

  if (nftData) {
    const { createdBy, metadata, ...others3 } = nftData;
    const { name, image, ...metadataProps } = metadata;
    const mediaFormat = types
      .filter((type) => type.slice(6) === metadataProps.format)[0]
      .slice(0, 5);
    return {
      title: name,
      file: image,
      saleCreated: dataObject.createdAt || "NA",
      ...returned,
      ...metadataProps,
      mediaFormat,
      ...others3,
    };
  } else {
    const { metadata } = dataObject;
    const { name, image, ...metadataProps } = metadata;
    const mediaFormat = types
      .filter((type) => type.slice(6) === metadataProps.format)[0]
      .slice(0, 5);
    return {
      ...returned,
      title: name,
      file: image,
      mediaFormat,
      ...metadataProps,
    };
  }
  // return returned;
}

const processHistoryData = async (histArr: any[]) => {
  let processedHistory = [];
  if (histArr.length > 0) {
    for (let i = 0; i < histArr.length; i++) {
      const histData = histArr[i];
      const data = {
        amount: histData?.amount,
        type: histData?.type,
        time: histData?.createdAt,

        // TODO: this just returns the id of the user not the details
        user: {
          username: histData.user.username ?? null,
          profilePic: histData.user?.profilePic ?? null,
          name: histData.user?.name ?? null,
        },
      };
      processedHistory.push(data);
    }
  }
  return processedHistory;
};

const getMetadata = async (url: string, id?: string) => {
  try {
    if (url) {
      const metaData = await fetch(url);
      const res = await metaData.json();
      const mediaFormat = types
        .filter((type) => type.slice(6) === res.format)[0]
        .slice(0, 5);
      return { ...res, mediaFormat };
    }
  } catch (error: any) {
    /**
     * report to the admin dashboard
     */
    // console.log(id);
    throw new Error("Fetching metadata failed");
  }
};
