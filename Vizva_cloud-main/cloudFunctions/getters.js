// Contains get Methods

// this query will fetch details of all the nft's.
Moralis.Cloud.define("getAllNFTDetails", async (request) => {
  try {
    const pipeQuery = [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$_p_nftData", { $concat: ["NFTData$", "$$objectId"] }] },
              { $eq: ["$status", "$$status"] },
            ],
          },
        },
      },
    ];
    function getQuery(type) {
      const _collection = type == "onAuction" ? "AuctionData" : "SaleData";
      const query = [
        { match: { saleType: type } },
        {
          lookup: {
            from: _collection,
            let: { objectId: "$_id", status: "active" },
            pipeline: pipeQuery,
            as: "saleData",
          },
        },
        {
          unwind: { path: "$saleData" },
        },
        {
          project: {
            objectId: 1,
            createdAt: 1,
            currency: 1,
            minted: 1,
            nft_owner: 1,
            objectId: 1,
            onSale: 1,
            saleData: 1,
            saleType: 1,
            size: 1,
            tags: 1,
            tokenAddress: 1,
            tokenId: 1,
            tokenURI: 1,
            updatedAt: 1,
            views: 1,
            userId: { $substr: ["$_p_createdBy", "_User$".length, -1] },
          },
        },
        {
          lookup: {
            from: "_User",
            localField: "userId",
            foreignField: "_id",
            as: "createdBy",
          },
        },
        {
          unwind: { path: "$createdBy" },
        },
        {
          project: {
            createdBy: {
              _acl: 0,
              _auth_data_moralisEth: 0,
              accounts: 0,
              agreedToTerms: 0,
              _created_at: 0,
              _rperm: 0,
              _updated_at: 0,
              _wperm: 0,
            },
          },
        },
      ];
      if (type != "inactive") return query;
      query.splice(1, 2);
      return query;
    }
    let result = [];

    const query = new Moralis.Query("NFTData");
    const auctionResult = await query.aggregate(getQuery("onAuction"));
    const saleResult = await query.aggregate(getQuery("onSale"));
    const inactiveResult = await query.aggregate(getQuery("inactive"));
    result.push(...auctionResult, ...saleResult, ...inactiveResult);
    return result;
  } catch (error) {
    logger.error(error.message);
    throw new Error("fetching nft details failed");
  }
});

// Cloud function for Getting User Owned NFTs With Username
Moralis.Cloud.define(
  "getUserOwnedItemsWithUsername",
  async (request) => {
    try {
      const username = request.params.username;
      const skip = request.params.skip || 0;
      const filter = request.params.filter || "All";
      if (!username) return;
      const userQuery = new Moralis.Query(Moralis.User);
      userQuery.equalTo("username", username);
      const userObject = await userQuery.first({ useMasterKey: true });
      const NFTData = Moralis.Object.extend("NFTData");
      const query = new Moralis.Query(NFTData);
      const ethAddress = userObject.get("ethAddress");
      query.equalTo("nft_owner", ethAddress);
      query.notEqualTo("createdBy", userObject);
      if (filter === "Auctions") {
        query.equalTo("saleType", "onAuction");
      }
      if (filter === "Instant Buy") {
        query.equalTo("saleType", "onSale");
      }
      if (filter === "On Sale") {
        query.equalTo("onSale", true);
      }
      query.descending("createdAt");
      query.select(
        "minted",
        "size",
        "objectId",
        "onSale",
        "tokenURI",
        "tokenId",
        "tokenAddress",
        "views",
        "saleType",
        "createdBy.username",
        "createdBy.profilePic",
        "nft_owner",
        "metadata"
      );
      query.skip(skip);
      query.limit(8);
      const queryResults = await query.find({ useMasterKey: true });
      const results = [];
      // get price and bids of onSale & onAuction NFTs
      for (let i = 0; i < queryResults.length; i++) {
        const nftQuery = queryResults[i];
        const saleType = nftQuery.get("saleType");
        let artworkObject = JSON.parse(JSON.stringify(nftQuery));
        if (saleType == "onSale") {
          // get SaleData object from SaleData class
          const saleDataQuery = new Moralis.Query("SaleData");
          saleDataQuery.equalTo("nftData", nftQuery);
          saleDataQuery.select("price", "currency", "status");
          const saleDataQueryResult = await saleDataQuery.first({
            useMasterKey: true,
          });
          if (saleDataQueryResult) {
            artworkObject.price = saleDataQueryResult.get("price");
            artworkObject.currency = saleDataQueryResult.get("currency");
          } else {
            artworkObject.price = 0;
            artworkObject.currency = "";
          }
        } else if (saleType == "onAuction") {
          // get AuctionData object from AuctionData class
          const auctionDataQuery = new Moralis.Query("AuctionData");
          auctionDataQuery.equalTo("nftData", nftQuery);
          auctionDataQuery.select(
            "minBid",
            "currency",
            "status",
            "highestBid",
            "endTime"
          );
          const auctionDataQueryResult = await auctionDataQuery.first({
            useMasterKey: true,
          });
          if (auctionDataQueryResult) {
            artworkObject.minBid = auctionDataQueryResult.get("minBid");
            artworkObject.highestBid = auctionDataQueryResult.get("highestBid");
            artworkObject.currency = auctionDataQueryResult.get("currency");
            artworkObject.endTime = auctionDataQueryResult.get("endTime");
          } else {
            artworkObject.minBid = 0;
            artworkObject.highestBid = 0;
            artworkObject.currency = "";
            artworkObject.endTime = "";
          }
        } else {
          artworkObject.price = 0;
          artworkObject.currency = "";
        }
        results.push(artworkObject);
      }
      return results;
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    fields: ["username"],
  }
);

// Cloud function for Getting User Created NFTs With Username
Moralis.Cloud.define(
  "getUserCreatedItemsWithUsername",
  async (request) => {
    try {
      const username = request.params.username;
      const userQuery = new Moralis.Query(Moralis.User);
      const skip = request.params.skip || 0;
      const filter = request.params.filter || "All";
      userQuery.equalTo("username", username);
      const userObject = await userQuery.first({ useMasterKey: true });
      const NFTData = Moralis.Object.extend("NFTData");
      const query = new Moralis.Query(NFTData);
      query.equalTo("createdBy", userObject);
      query.exists("tokenId");
      if (filter === "Auctions") {
        query.equalTo("saleType", "onAuction");
      }
      if (filter === "Instant Buy") {
        query.equalTo("saleType", "onSale");
      }
      if (filter === "On Sale") {
        query.equalTo("onSale", true);
      }
      query.descending("createdAt");
      query.select(
        "minted",
        "size",
        "objectId",
        "onSale",
        "tokenURI",
        "tokenId",
        "tokenAddress",
        "views",
        "saleType",
        "createdBy.username",
        "createdBy.profilePic",
        "nft_owner",
        "metadata"
      );
      query.skip(skip);
      query.limit(8);
      const queryResults = await query.find({ useMasterKey: true });
      const results = [];
      // get price and bids of onSale & onAuction NFTs
      for (let i = 0; i < queryResults.length; i++) {
        const nftQuery = queryResults[i];
        const saleType = nftQuery.get("saleType");
        let artworkObject = JSON.parse(JSON.stringify(nftQuery));
        if (saleType == "onSale") {
          // get SaleData object from SaleData class
          const saleDataQuery = new Moralis.Query("SaleData");
          saleDataQuery.equalTo("nftData", nftQuery);
          saleDataQuery.select("price", "currency", "status");
          const saleDataQueryResult = await saleDataQuery.first({
            useMasterKey: true,
          });
          if (saleDataQueryResult) {
            artworkObject.price = saleDataQueryResult.get("price");
            artworkObject.currency = saleDataQueryResult.get("currency");
          } else {
            artworkObject.price = 0;
            artworkObject.currency = "";
          }
        } else if (saleType == "onAuction") {
          // get AuctionData object from AuctionData class
          const auctionDataQuery = new Moralis.Query("AuctionData");
          auctionDataQuery.equalTo("nftData", nftQuery);
          auctionDataQuery.select(
            "minBid",
            "currency",
            "status",
            "highestBid",
            "endTime"
          );
          const auctionDataQueryResult = await auctionDataQuery.first({
            useMasterKey: true,
          });
          if (auctionDataQueryResult) {
            artworkObject.minBid = auctionDataQueryResult.get("minBid");
            artworkObject.highestBid = auctionDataQueryResult.get("highestBid");
            artworkObject.currency = auctionDataQueryResult.get("currency");
            artworkObject.endTime = auctionDataQueryResult.get("endTime");
          } else {
            artworkObject.minBid = 0;
            artworkObject.highestBid = 0;
            artworkObject.currency = "";
            artworkObject.endTime = "";
          }
        } else {
          artworkObject.price = 0;
          artworkObject.currency = "";
        }
        results.push(artworkObject);
      }
      return results;
    } catch (error) {
      logger.error(error.message);
      throw new Error("getting user owned item failed");
    }
  },
  {
    fields: ["username", "skip"],
  }
);
// Cloud funtion for getting User Activity & Notifications
Moralis.Cloud.define(
  "getUserActivity",
  async (request) => {
    try {
      const UserActivity = Moralis.Object.extend("UserActivity");
      const query = new Moralis.Query(UserActivity);
      query.equalTo("user", request.user);
      query.descending("createdAt");
      query.select(
        "miscUserinfo.objectId",
        "miscUserinfo.profilePic",
        "miscUserinfo.name",
        "miscUserinfo.username",
        "description",
        "notifyUser",
        "user.objectId",
        "user.username",
        "user.profilePic",
        "user.name",
        "NFTData.objectId",
        "NFTData.metadata",
        "amount",
        "type",
        "remark",
        "status",
        "read"
      );
      const queryResults = await query.find({ useMasterKey: true });
      for (let i = 0; i < queryResults.length; i++) {
        const data = queryResults[i];
        if (!data.get("read")) {
          data.set("read", true);
          await data.save(null, { useMasterKey: true });
        }
      }
      return queryResults;
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    requireUser: true,
  }
);

// Cloud funtion for Getting All Items on Auction
Moralis.Cloud.define("getAllOnAuctionItems", async (request) => {
  try {
    const query = new Moralis.Query("AuctionData");
    const skip = request.params.skip || 0;
    const filter = request.params.filter || "createdAt";
    const sort = request.params.sort || "descending";
    query.equalTo("status", "active");
    query.greaterThan("endTime", new Date());
    query.select(
      "objectId",
      "createdAt",
      "status",
      "endTime",
      "minBid",
      "bids",
      "highestBid",
      "buyer",
      "marketId",
      "currency",
      "createdBy.username",
      "createdBy.profilePic",
      "nftData.minted",
      "nftData.size",
      "nftData.objectId",
      "nftData.onSale",
      "nftData.voucher",
      "nftData.tokenURI",
      "nftData.tokenId",
      "nftData.tokenAddress",
      "nftData.saleType",
      "nftData.createdBy.username",
      "nftData.createdBy.profilePic",
      "nftData.nft_owner",
      "nftData.metadata"
    );
    query.limit(8);
    query.skip(skip);
    if (sort === "ascending") {
      query.ascending(filter);
    } else {
      query.descending(filter);
    }
    const queryResults = await query.find({ useMasterKey: true });
    return queryResults;
  } catch (error) {
    logger.error(error.message);
  }
});

Moralis.Cloud.define("getAllAuctionByUser", async (request) => {
  try {
    const Auction = Moralis.Object.extend("AuctionData");
    const auctionQuery = new Moralis.Query(Auction);
    auctionQuery.equalTo("createdBy", request.user);
    auctionQuery.select(
      "objectId",
      "createdAt",
      "status",
      "endTime",
      "minBid",
      "bids",
      "highestBid",
      "buyer",
      "marketId",
      "currency",
      "createdBy.username",
      "createdBy.profilePic",
      "nftData.minted",
      "nftData.size",
      "nftData.objectId",
      "nftData.onSale",
      "nftData.voucher",
      "nftData.tokenURI",
      "nftData.tokenId",
      "nftData.tokenAddress",
      "nftData.saleType",
      "nftData.createdBy.username",
      "nftData.createdBy.profilePic",
      "nftData.nft_owner",
      "nftData.metadata"
    );
    const queryResults = await auctionQuery.find({ useMasterKey: true });
    return queryResults;
  } catch (error) {
    logger.error(error.message);
    throw new Error("getAllAuctionByUser failed");
  }
});

// Cloud function to get information on NFT's that are on sale
Moralis.Cloud.define(
  "getSaleNFTinfo",
  async (request) => {
    try {
      let saleQuery;
      const NFTquery = new Moralis.Query("NFTData");
      const historyQuery = new Moralis.Query("History");
      const userQuery = new Moralis.Query("User");
      const ID = request.params.Id || 0;
      const sessionToken = request.user?.get("sessionToken");
      NFTquery.equalTo("objectId", ID);
      NFTquery.select(
        "minted",
        "size",
        "objectId",
        "onSale",
        "voucher",
        "tokenURI",
        "tokenId",
        "tokenAddress",
        "saleType",
        "createdBy",
        "createdBy?.id",
        // "createdBy.username",
        // "createdBy.profilePic",
        // "createdBy.name",
        "nft_owner",
        "metadata",
        "views",
        "tags",
        "metadata"
      );
      const NFTQueryResult = await NFTquery.first({ useMasterKey: true });
      if (!NFTQueryResult) return {};

      userQuery.equalTo("objectId", NFTQueryResult?.attributes?.createdBy?.id);
      userQuery.select("username", "name", "profilePic", "coverPic");
      const createdBy = await userQuery.first({ useMasterKey: true });
      historyQuery.equalTo("NFTData", NFTQueryResult);
      historyQuery.select(
        "NFTData.objectId",
        "amount",
        "createdAt",
        "remark",
        "updatedAt",
        "type",
        "user.username",
        "user.name",
        "user.profilePic"
      );
      const history = await historyQuery.find({ useMasterKey: true });
      const NFTObject = JSON.parse(JSON.stringify(NFTQueryResult));

      // search in UserLikes class for total likes on this NFT
      const userLikesQuery = new Moralis.Query("UserLikes");
      userLikesQuery.equalTo("likeClass", "NFTData");
      userLikesQuery.equalTo("likeObjectId", ID);
      NFTObject.likes = (await userLikesQuery.find()).length;

      // NOT WORKING AS THE FUNCTION IS BEING CALLED VIA REST API & REQUEST.USER IS NOT AVAILABLE
      // CHECKING THIS VIA ANOTHER CLOUD CALL
      // // if request.user is not null, then check if user has liked this NFT
      // if (request.user) {
      //   const hasUserLikedQuery = new Moralis.Query("UserLikes");
      //   hasUserLikedQuery.equalTo("user", request.user);
      //   hasUserLikedQuery.equalTo("likeClass", "NFTData");
      //   hasUserLikedQuery.equalTo("likeObjectId", ID);
      //   const hasUserLiked = await hasUserLikedQuery.first({ useMasterKey: true });
      //   NFTObject.isLiked = hasUserLiked ? true : false;
      // } else {
      //   NFTObject.isLiked = false;
      // }

      // increase the view count
      if (sessionToken) {
        await incrementViewCount(sessionToken, ID);
      }
      if (NFTObject.saleType == "inactive") {
        const result = {
          nftData: {
            ...NFTObject,
            createdBy,
          },
          history,
        };
        return result;
      }
      if (NFTObject.saleType == "onAuction") {
        const AuctionData = Moralis.Object.extend("AuctionData");
        saleQuery = new Moralis.Query(AuctionData);
      } else if (NFTObject.saleType == "onSale") {
        const SaleData = Moralis.Object.extend("SaleData");
        saleQuery = new Moralis.Query(SaleData);
      }
      saleQuery.equalTo("status", "active");
      saleQuery.equalTo("nftData", NFTQueryResult);
      const saleQueryResult = await saleQuery.first({ useMasterKey: true });
      const saleObject = JSON.parse(JSON.stringify(saleQueryResult));
      const result = {
        ...saleObject,
        nftData: {
          ...NFTObject,
          createdBy,
        },
        history,
      };
      return result;
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    fields: ["Id"],
  }
);

Moralis.Cloud.define("getBidsByUser", async (request) => {
  try {
    const bids = Moralis.Object.extend("Bids");
    const query = new Moralis.Query(bids);
    query.equalTo("bidder", request.user);
    query.select(
      "objectId",
      "createdAt",
      "status",
      "bidder",
      "signedVoucher",
      "auction.objectId",
      "auction.minBid",
      "auction.highestBid",
      "auction.endTime",
      "auction.currency",
      "auction.status",
      "auction.buyer",
      "auction.nftData.minted",
      "auction.nftData.size",
      "auction.nftData.objectId",
      "auction.nftData.onSale",
      "auction.nftData.tokenURI",
      "auction.nftData.tokenId",
      "auction.nftData.tokenAddress",
      "auction.nftData.saleType",
      "auction.nftData.createdBy.username",
      "auction.nftData.createdBy.profilePic",
      "auction.nftData.nft_owner",
      "auction.nftData.views",
      "auction.nftData.metadata"
    );
    const result = await query.find({ useMasterKey: true });
    let outData = [];
    for (let i = 0; i < result.length; i++) {
      const auction = result[i].get("auction");
      const objIndex = outData.findIndex((item) => item.objectId == auction.id);
      if (objIndex == -1) {
        outData.push({
          ...JSON.parse(JSON.stringify(auction)),
          bids: [result[i]],
        });
      } else {
        //const objIndex = outData.findIndex(item => item.id == auction.id)
        outData[objIndex].bids.push(result[i]);
      }
    }
    return outData;
  } catch (error) {
    logger.error("getBidsByUser failed:", error.message);
    throw new Error("getBidsByUser failed");
  }
});

// Cloud function to get the highest bid on an auction
Moralis.Cloud.define("getHighestBid", async (request) => {
  try {
    const auctionId = request.params.auctionId;
    const Bids = Moralis.Object.extend("Bids");
    const query = new Moralis.Query(Bids);
    const Auction = Moralis.Object.extend("AuctionData");
    const auctionQuery = new Moralis.Query(Auction);
    query.matchesQuery("auction", auctionQuery.equalTo("objectId", auctionId));
    query.equalTo("status", "active");
    query.descending("signedVoucher.bid");
    query.select(
      "signedVoucher",
      "bidder.username",
      "bidder.profilePic",
      "bidder.ethAddress",
      "auction",
      "status",
      "createdAt"
    );
    const bids = await query.first({ useMasterKey: true });
    if (bids?.attributes) return { objectId: bids.id, ...bids?.attributes };
    return null;
  } catch (error) {
    logger.error(error.message);
    throw new Error("failed fetching highest bid");
  }
});

// Cloud function to get all the users
Moralis.Cloud.define("getAllUsers", async (request) => {
  try {
    const query = new Moralis.Query("User");
    const skipId = request.params.skipId || 0;
    const skipCount = request.params.skip || 0;
    const filter = request.params.filter || "newest to oldest";
    query.notEqualTo("objectId", skipId);
    query.select(
      "objectId",
      "bio",
      "name",
      "profilePic",
      "coverPic",
      "username",
      "ethAddress",
      "verified",
      "nftCreated",
      "nftSold"
    );
    query.limit(8);
    query.skip(skipCount);
    if (filter === "newest to oldest") {
      query.descending("createdAt");
    }
    if (filter === "most created") {
      query.descending("nftCreated");
    }
    if (filter === "most sold") {
      query.descending("nftSold");
    }
    const queryResults = await query.find({ useMasterKey: true });
    const result = [];
    for (let i = 0; i < queryResults.length; i++) {
      // for each user
      const user = queryResults[i];
      let userObject = JSON.parse(JSON.stringify(user));
      if (userObject.username == "coreservices") {
        // if username is coreservices, skip this loop
        continue;
      }

      if (request.user) {
        // check if request user is following the user
        const followerQuery = new Moralis.Query("UserFollow");
        followerQuery.equalTo("follower", request.user);
        followerQuery.equalTo("following", user);
        const followerQueryResult = await followerQuery.first({
          useMasterKey: true,
        });
        userObject.isFollowing = followerQueryResult ? true : false;

        // check if request user has liked the user
        const userLikesQuery = new Moralis.Query("UserLikes");
        userLikesQuery.equalTo("User", request.user);
        userLikesQuery.equalTo("likeClass", "User");
        userLikesQuery.equalTo("likeObjectId", userObject.objectId);
        const userLikesQueryResult = await userLikesQuery.first({
          useMasterKey: true,
        });
        userObject.isLiked = userLikesQueryResult ? true : false;
      } else {
        userObject.isLiked = false;
        userObject.isFollowing = false;
      }
      result.push(userObject);
    }
    return result;
  } catch (error) {
    logger.error(error.message);
  }
});

// Cloud function to get all the items that are on sale
Moralis.Cloud.define("getAllOnSaleItems", async (request) => {
  try {
    const SaleData = Moralis.Object.extend("SaleData");
    const skip = request.params.skip || 0;
    const filter = request.params.filter || "createdAt";
    const sort = request.params.sort || "descending";
    const query = new Moralis.Query(SaleData);
    query.equalTo("status", "active");
    query.select(
      "objectId",
      "createdAt",
      "status",
      "price",
      "buyer",
      "marketId",
      "currency",
      "createdBy.username",
      "createdBy.profilePic",
      "nftData.minted",
      "nftData.size",
      "nftData.objectId",
      "nftData.onSale",
      "nftData.tokenURI",
      "nftData.tokenId",
      "nftData.tokenAddress",
      "nftData.saleType",
      "nftData.createdBy.username",
      "nftData.createdBy.profilePic",
      "nftData.nft_owner",
      "nftData.views",
      "nftData.metadata"
    );
    query.limit(8);
    query.skip(skip);
    if (sort === "ascending") {
      query.ascending(filter);
    } else {
      query.descending(filter);
    }
    const queryResults = await query.find({ useMasterKey: true });
    return queryResults;
  } catch (error) {
    logger.error(error.message);
  }
});

// Cloud function to get user information from username
Moralis.Cloud.define(
  "getUserInfoWithUsername",
  async (request) => {
    try {
      const username = request.params.username;
      const query = new Moralis.Query("User");
      query.equalTo("username", username);
      query.select(
        "objectId",
        "accounts",
        "verified",
        "twitter",
        "instagram",
        "bio",
        "name",
        "profilePic",
        "coverPic",
        "username",
        "ethAddress",
        "verified"
      );
      const queryResults = await query.first({ useMasterKey: true });
      const userObject = JSON.parse(JSON.stringify(queryResults));
      // logger.info(JSON.stringify(request));

      // Checking if the user is following via another "isFollowingUser" function.
      // Commented out as "request.user" NOT WORKING DUE TO CLOUD FUNCTION BEING CALLED VIA REST API in GetServerSideProps (Pages/Username/Index.tsx)
      // CHECK IF USER IS FOLLOWING THE USER
      // if (request.user.id && request.user.id != queryResults.objectId) {
      //   const requestUserQuery = new Moralis.Query("User");
      //   requestUserQuery.equalTo("objectId", request.user.id);
      //   const requestUserObject = await requestUserQuery.first({useMasterKey: true});
      //   const Followers = Moralis.Object.extend("UserFollow");
      //   const followerQuery = new Moralis.Query(Followers);
      //   followerQuery.equalTo("follower", requestUserObject);
      //   followerQuery.equalTo("following", queryResults);
      //   const followerQueryResult = await followerQuery.first({useMasterKey: true});
      //   if (followerQueryResult) {
      //     userObject.isFollowing = true;
      //   } else {
      //     userObject.isFollowing = false;
      //   }
      // } else {
      //   userObject.isFollowing = false;
      // }

      // get the nftCreated count of the user
      const nftCreatedQuery = new Moralis.Query("NFTData");
      nftCreatedQuery.equalTo("createdBy", queryResults);
      nftCreatedQuery.exists("tokenId");
      const nftCreatedCount = (await nftCreatedQuery.find()).length;
      userObject.nftCreated = nftCreatedCount;

      // get the nftOwned count of the user
      const nftOwnedQuery = new Moralis.Query("NFTData");
      nftOwnedQuery.equalTo("nft_owner", queryResults.get("ethAddress"));
      nftOwnedQuery.notEqualTo("createdBy", queryResults);
      const nftOwnedCount = (await nftOwnedQuery.find()).length;
      userObject.nftOwned = nftOwnedCount;

      // get wishlisted count
      const nftWishlistQuery = new Moralis.Query("UserWishlist");
      nftWishlistQuery.equalTo("User", queryResults);
      nftOwnedQuery.notEqualTo("createdBy", queryResults);
      const nftWishlistCount = (await nftOwnedQuery.find()).length;
      userObject.nftWishlisted = nftWishlistCount;

      // Get the follower and following count and add it to the user object
      const userFollowQuery = new Moralis.Query("UserFollow");
      userFollowQuery.equalTo("follower", queryResults);
      const followerCount = (await userFollowQuery.find()).length;
      const UserFollowingQuery = new Moralis.Query("UserFollow");
      UserFollowingQuery.equalTo("following", queryResults);
      const followingCount = (await UserFollowingQuery.find()).length;
      userObject.following = followerCount;
      userObject.followers = followingCount;

      // if followerCount > 0, get the followers name, objectid, username and profile pic and add it to the user object
      if (followerCount > 0) {
        const followersQuery = new Moralis.Query("UserFollow");
        followersQuery.equalTo("follower", queryResults);
        followersQuery.select(
          "following.objectId",
          "following.name",
          "following.username",
          "following.profilePic"
        );
        const followersQueryResults = await followersQuery.find({
          useMasterKey: true,
        });
        userObject.followingUsers = followersQueryResults;
      }
      // if followingCount > 0, get the following name, objectid, username and profile pic and add it to the user object
      if (followingCount > 0) {
        const followingQuery = new Moralis.Query("UserFollow");
        followingQuery.equalTo("following", queryResults);
        followingQuery.select(
          "follower.objectId",
          "follower.name",
          "follower.username",
          "follower.profilePic"
        );
        const followingQueryResults = await followingQuery.find({
          useMasterKey: true,
        });
        userObject.followersUsers = followingQueryResults;
      }
      return userObject;
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    fields: ["username"],
  }
);

// cloud function to get wishlisted items of a user
Moralis.Cloud.define("getWishlist", async (request) => {
  try {
    const user = request.user;
    if (!user) return; // bail early if user is not logged in
    // get wishlist items of user
    const wishlistQuery = new Moralis.Query("UserWishlist");
    wishlistQuery.equalTo("User", user);
    wishlistQuery.select(
      "NFT.minted",
      "NFT.size",
      "NFT.objectId",
      "NFT.onSale",
      "NFT.tokenURI",
      "NFT.tokenId",
      "NFT.tokenAddress",
      "NFT.views",
      "NFT.saleType",
      "NFT.createdBy.username",
      "NFT.createdBy.profilePic",
      "NFT.nft_owner"
    );
    const wishlistQueryResult = await wishlistQuery.find({
      useMasterKey: true,
    });
    // const wishlist = [];
    // for (let i = 0; i < wishlistQueryResult.length; i++) {
    //   wishlist.push(wishlistQueryResult[i].get("NFT").id);
    // }
    // return wishlist;
    return wishlistQueryResult;
  } catch (error) {
    logger.error(error.message);
  }
});

// cloud function to get wishlisted items of a user by username
Moralis.Cloud.define(
  "getWishlistItemsWithUsername",
  async (request) => {
    try {
      const username = request.params.username;
      const skip = request.params.skip || 0;
      const filter = request.params.filter || "All";
      if (!username) return []; // bail early if username is not provided
      // get user object by username
      const userQuery = new Moralis.Query("User");
      userQuery.equalTo("username", username);
      const user = await userQuery.first({ useMasterKey: true });
      if (!user) return []; // bail early if user is not found
      // * BAIL EARLY AS USER SHOULD ONLY BE ABLE TO SEE THEIR OWN WISHLIST AND NOT OF OTHER USERS * //
      if (user.id != request.user.id) return [];

      // get wishlist items of user
      const wishlistNFTQuery = new Moralis.Query("UserWishlist");
      wishlistNFTQuery.equalTo("User", user);
      wishlistNFTQuery.select("NFT.objectId");
      wishlistNFTQuery.limit(8);
      wishlistNFTQuery.skip(skip);
      const wishlistNFTs = await wishlistNFTQuery.find({ useMasterKey: true });
      const wishlist = [];
      // searching in NFTData to keep the response similar to getUserCreatedItemsWithUsername and getUserOwnedItemsWithUsername
      for (let i = 0; i < wishlistNFTs.length; i++) {
        const nftQuery = new Moralis.Query("NFTData");
        nftQuery.equalTo("objectId", wishlistNFTs[i].get("NFT").id);
        if (filter === "Auctions") {
          nftQuery.equalTo("saleType", "onAuction");
        }
        if (filter === "Instant Buy") {
          nftQuery.equalTo("saleType", "onSale");
        }
        if (filter === "On Sale") {
          nftQuery.equalTo("onSale", true);
        }
        nftQuery.descending("createdAt");
        nftQuery.select(
          "minted",
          "size",
          "objectId",
          "onSale",
          "tokenURI",
          "tokenId",
          "tokenAddress",
          "views",
          "saleType",
          "createdBy.username",
          "createdBy.profilePic",
          "metadata",
          "nft_owner"
        );
        const nftQueryResult = await nftQuery.first({ useMasterKey: true });
        const saleType = nftQueryResult.get("saleType");
        let artworkObject = JSON.parse(JSON.stringify(nftQueryResult));
        if (saleType == "onSale") {
          // get SaleData object from SaleData class
          const saleDataQuery = new Moralis.Query("SaleData");
          saleDataQuery.equalTo("nftData", nftQueryResult);
          saleDataQuery.select("price", "currency", "status");
          const saleDataQueryResult = await saleDataQuery.first({
            useMasterKey: true,
          });
          if (saleDataQueryResult) {
            artworkObject.price = saleDataQueryResult.get("price");
            artworkObject.currency = saleDataQueryResult.get("currency");
          } else {
            artworkObject.price = 0;
            artworkObject.currency = "";
          }
        } else if (saleType == "onAuction") {
          // get AuctionData object from AuctionData class
          const auctionDataQuery = new Moralis.Query("AuctionData");
          auctionDataQuery.equalTo("nftData", nftQueryResult);
          auctionDataQuery.select("minBid", "currency", "status", "highestBid");
          const auctionDataQueryResult = await auctionDataQuery.first({
            useMasterKey: true,
          });
          if (auctionDataQueryResult) {
            artworkObject.minBid = auctionDataQueryResult.get("minBid");
            artworkObject.highestBid = auctionDataQueryResult.get("highestBid");
            artworkObject.currency = auctionDataQueryResult.get("currency");
          } else {
            artworkObject.minBid = 0;
            artworkObject.highestBid = 0;
            artworkObject.currency = "";
          }
        } else {
          artworkObject.price = 0;
          artworkObject.currency = "";
        }
        wishlist.push(artworkObject);
      }
      return wishlist;
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    fields: ["username", "skip"],
  }
);

// Cloud function to generate suggestions for search by keyword
Moralis.Cloud.define(
  "getSearchSuggestions",
  async (request) => {
    try {
      const keyword = request.params.keyword;
      if (!keyword) return [];
      //search for nft's title & description
      const nft_title_query = new Moralis.Query("NFTData");
      nft_title_query.matches("metadata.name", keyword, "i");
      const nft_description_query = new Moralis.Query("NFTData");
      nft_description_query.matches("metadata.description", keyword, "i");
      const nft_search_suggestions_query = Moralis.Query.or(
        nft_title_query,
        nft_description_query
      );
      nft_search_suggestions_query.limit(8); // generate 10 suggestions
      nft_search_suggestions_query.descending("createdAt");
      const nft_search_suggestions = await nft_search_suggestions_query.find({
        useMasterKey: true,
      });
      const nft_suggestions = [];
      for (let i = 0; i < nft_search_suggestions.length; i++) {
        const nft = nft_search_suggestions[i];
        const nft_format = nft.get("metadata").format ?? "png";
        if (nft_format == "png" || nft_format == "jpeg") {
          const nft_suggestion = {
            type: "artwork",
            id: nft.id ?? "",
            name: nft.get("metadata").name ?? "",
            image: nft.get("metadata").image ?? "",
            createdBy: nft.get("createdBy").id ?? "",
            format: nft_format,
          };
          nft_suggestions.push(nft_suggestion);
        } else {
          continue;
        }
      }

      const collection_query = new Moralis.Query("Collection");
      collection_query.matches("name", keyword, "i");
      collection_query.limit(8);
      collection_query.descending("createdAt");
      const collection_search_suggestion = await collection_query.find({
        useMasterKey: true,
      });
      const collection_suggestions = [];
      for (let i = 0; i < collection_search_suggestion.length; i++) {
        const collection = collection_search_suggestion[i].attributes;
        collection_suggestions.push({
          type: "collection",
          id: collection_search_suggestion[i].id,
          name: collection.name ?? "",
          image: collection.displayPicture?._url ?? "",
        });
      }


      const username_query = new Moralis.Query("User");
      username_query.matches("username", keyword, "i");
      const userfullname_query = new Moralis.Query("User");
      userfullname_query.matches("name", keyword, "i");
      const user_search_suggestions_query = Moralis.Query.or(
        username_query,
        userfullname_query
      );
      user_search_suggestions_query.limit(8);
      user_search_suggestions_query.descending("createdAt");
      const user_search_suggestions = await user_search_suggestions_query.find({
        useMasterKey: true,
      });
      const artist_suggestions = [];
      for (let i = 0; i < user_search_suggestions.length; i++) {
        const user = user_search_suggestions[i].attributes;
        artist_suggestions.push({
          type: "artist",
          id: user_search_suggestions[i].id,
          username: user.username ?? "",
          name: user.name ?? "",
          image: user.profilePic?._url ?? "",
        });
      }
      // // push nft suggestions and artist suggestions to final suggestions
      const results = [];
      results.push(...nft_suggestions, ...artist_suggestions, ...collection_suggestions);
      return results;
      // return nft_suggestions;
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    fields: ["keyword"],
  }
);
