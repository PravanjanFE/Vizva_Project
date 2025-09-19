// contains Triggers

// Cloud function to run before saving NFTData Class
Moralis.Cloud.beforeSave("NFTData", async (request) => {
  try {
    if (request.object.get("newData") === true) {
      const userID = request.user.id;
      const ethAddress = request.user.attributes.ethAddress;
      const userQuery = new Moralis.Query(Moralis.User);
      userQuery.equalTo("objectId", userID);
      const userObject = await userQuery.first({ useMasterKey: true });
      if (userObject) {
        request.object.set("createdBy", userObject);
        request.object.set("newData", false);
        request.object.set("nft_owner", ethAddress);
      }
    }
  } catch (error) {
    logger.error("beforesave NFTData failed");
    logger.error(JSON.stringify(error));
    logger.error(error.message);
  }
});

Moralis.Cloud.beforeSave("User", async (request) => {
  if (!request.user && !request.master) {
    const authData = request.object.get("authData");
    if (authData && authData.moralisEth) {
      const { data, id } = authData.moralisEth;
      const code = data.slice(38, 46);
      const inviteCodeData = Moralis.Object.extend("InviteCodeData");
      const query = new Moralis.Query(inviteCodeData);
      query.equalTo("walletAddress", id);
      query.equalTo("valid", true);
      const inviteData = await query.first({ useMasterKey: true });
      if (!inviteData) {
        throw new Error("no_invite_code");
      }
      const allottedCode = inviteData.get("inviteCode");
      if (allottedCode != code) {
        throw new Error("invite_code_mismatch");
      }
      inviteData.set("valid", false);
      inviteData.set("loggedIn", new Date());
      await inviteData.save(null, { useMasterKey: true });
    }
  }
});

// Cloud function to run after saving EthNFTOwners Class
// Task - craete a sync for Vizva Token
// Moralis.Cloud.afterSave("PolygonNFTTransfers", async (request) => {
//   try {
//     const owner = request.object.attributes.to_address;
//     const NFTData = Moralis.Object.extend("NFTData");
//     const tokenId = request.object.get("token_id");
//     const tokenAddress = request.object.get("token_address");
//     const query = new Moralis.Query(NFTData);
//     query.equalTo("tokenId", tokenId);
//     query.equalTo("tokenAddress", tokenAddress);
//     query.first().then((data) => {
//       if (owner == "0x0000000000000000000000000000000000000000") {
//         data.unset("tokenId");
//         data.set("nft_owner", owner);
//         logger.info(`NFT Id: ${tokenId} Address: ${tokenAddress} Burned`);
//       } else {
//         data.set("nft_owner", owner);
//         logger.info(
//           `NFT Id: ${tokenId} Address: ${tokenAddress} Owner updated to => ${owner}`
//         );
//       }
//       return data.save();
//     });
//   } catch (error) {
//     logger.error(error.message);
//   }
// });

Moralis.Cloud.afterSave("AuctionData", async (request) => {
  try {
    if (request.object.attributes.status == "cancelled") {
      const Bids = new Moralis.Object("Bids");
      const query = new Moralis.Query(Bids);
      const Auction = Moralis.Object.extend("AuctionData");
      const auctionQuery = new Moralis.Query(Auction);
      query.matchesQuery(
        "auction",
        auctionQuery.equalTo("objectId", request.object.id)
      );
      query.find().then((data) => {
        data.forEach((bidData) => {
          bidData.set("status", "saleCancelled");
          bidData.save(null, { useMasterKey: true });
        });
      });
    }
    if (request.object.attributes.status == "completed") {
      const userQuery = new Moralis.Query("User");
      userQuery.equalTo("objectId", request.object.get("createdBy").id);
      userQuery.first({ useMasterKey: true }).then((data) => {
        data.set("nftSold", data.get("nftSold") + 1);
        data.save(null, { useMasterKey: true });
      });
    }
  } catch (error) {
    logger.error("auction data aftersave trigger failed");
    logger.error(JSON.stringify(error));
    logger.error(error.message);
  }
});

Moralis.Cloud.afterSave("SaleData", async (request) => {
  try {
    if (request.object.attributes.status == "completed") {
      const userQuery = new Moralis.Query("User");
      userQuery.equalTo("objectId", request.object.get("createdBy").id);
      userQuery.first({ useMasterKey: true }).then((data) => {
        data.set("nftSold", data.get("nftSold") + 1);
        data.save(null, { useMasterKey: true });
      });
    }
  } catch (error) {
    logger.error("saledata aftersave trigger failed");
    logger.error(JSON.stringify(error));
    logger.error(error.message);
  }
});

Moralis.Cloud.afterSave("Bids", async (request) => {
  try {
    if (request.object.attributes.status == "active") {
      const Bids = new Moralis.Object("Bids");
      const query = new Moralis.Query(Bids);
      query.equalTo("auction", request.object.attributes.auction);
      query.equalTo("status", "active");
      query.notEqualTo("objectId", request.object.id);
      query.find().then((data) => {
        data.forEach((bidData) => {
          bidData.set("status", "outBidded");
          bidData.save(null, { useMasterKey: true });
        });
      });
    }
    if (request.object.attributes.status == "outBidded") {
      const AuctionData = Moralis.Object.extend("AuctionData");
      const query = new Moralis.Query(AuctionData);
      query.equalTo("objectId", request.object.attributes.auction.id);
      query.first().then((data) => {
        const nftData = data.get("nftData");
        const historyData = {
          user: request.object.get("bidder"),
          amount: data.get("highestBid"),
          type: "bid",
          remark: `outbidded`,
          NFTData: nftData,
        };
        addUserActivity({
          description: `Your Bid ${request.object.id} on auction: ${data.id} got outbidded`,
          notifyUser: true,
          ...historyData,
          status: "success",
        });
      });
    }
    if (request.object.attributes.status == "saleCancelled") {
      const AuctionData = Moralis.Object.extend("AuctionData");
      const query = new Moralis.Query(AuctionData);
      query.equalTo("objectId", request.object.attributes.auction.id);
      query.first().then((data) => {
        const nftData = data.get("nftData");
        const historyData = {
          user: request.object.get("bidder"),
          amount: "0",
          type: "bid",
          remark: `cancelled`,
        };
        addUserActivity({
          description: `The NFT auction ${data.id} you have placed a bid got cancelled`,
          notifyUser: true,
          ...historyData,
          status: "success",
          NFTData: nftData,
        });
      });
    }
    if (request.object.attributes.status == "bidCancelled") {
      const AuctionData = Moralis.Object.extend("AuctionData");
      const query = new Moralis.Query(AuctionData);
      query.equalTo("objectId", request.object.attributes.auction.id);
      query.first().then((data) => {
        const nftData = data.get("nftData");
        const historyData = {
          user: request.object.get("bidder"),
          amount: "0",
          type: "bid",
          remark: `cancelled`,
        };
        addUserActivity({
          description: `you calncelled the bid: ${request.object.id} on auction: ${data.id} `,
          notifyUser: false,
          ...historyData,
          status: "success",
          NFTData: nftData,
        });
      });
    }
    return true;
  } catch (error) {
    logger.error("bids aftersave failed");
    logger.error(JSON.stringify(error));
  }
});

Moralis.Cloud.afterSave("VizvaToken", async (request) => {
  try {
    const confirmed = request.object.get("confirmed");
    if (confirmed) return;
    const NFTData = Moralis.Object.extend("NFTData");
    const query = new Moralis.Query(NFTData);
    const userQuery = new Moralis.Query("User");
    const creatorQuery = new Moralis.Query("User");
    const ownerQuery = new Moralis.Query("User");
    const from = request.object.get("from");
    const to = request.object.get("to");
    const tokenId = request.object.get("tokenId");
    const address = request.object.get("address");
    const txHash = request.object.get("transaction_hash");
    userQuery.equalTo("ethAddress", to);
    const user = await userQuery.first({ useMasterKey: true });
    if (from == "0x0000000000000000000000000000000000000000") {
      query.equalTo("txHash", txHash);
      const nftData = await query.first();
      if (!nftData) {
        logger.info(`no nft data found for token Id: ${tokenId}`);
        return;
      }
      logger.info(`New token ${address}:${tokenId} minted to ${to}`);
      nftData.set("tokenId", tokenId);
      const mintHistory = {
        user,
        amount: "0",
        type: "minted",
        remark: "",
        NFTData: nftData,
      };
      await updateHistory(mintHistory);
      await addUserActivity({
        description: `token Id ${tokenId} of ${address} minted`,
        notifyUser: false,
        ...mintHistory,
        status: "success",
      });
      await nftData.save(null, { useMasterKey: true });
    } else {
      query.equalTo("tokenId", tokenId);
      query.equalTo("tokenAddress", address);
      const nftData = await query.first();
      if (!nftData) {
        logger.info(`no nft data found for token Id: ${tokenId}`);
        return;
      }
      if (to == "0x0000000000000000000000000000000000000000") {
        creatorQuery.equalTo("objectId", nftData.get("createdBy").id);
        ownerQuery.equalTo("ethAddress", nftData.get("nft_owner"));
        const creator = await creatorQuery.first({ useMasterKey: true });
        const owner = await ownerQuery.first({ useMasterKey: true });
        addUserActivity({
          description: `you burned tokenId ${tokenId} of ${address} `,
          notifyUser: false,
          status: "success",
          user: owner,
          amount: "0",
          type: "burn",
          remark: "owner",
          NFTData: nftData,
        });
        if (owner.id != creator.id) {
          addUserActivity({
            description: `The NFT with tokenId ${tokenId} of ${address} that you have created got burned`,
            notifyUser: true,
            status: "success",
            user: creator,
            amount: "0",
            type: "burn",
            remark: "creator",
            NFTData: nftData,
            miscUserinfo: owner,
          });
        }
        nftData.unset("tokenId");
        nftData.unset("saleType");
        nftData.set("nft_owner", to);
        creator.set("nftCreated", creator.get("nftCreated") - 1);
        creator.save(null, { useMasterKey: true });
        logger.info(`NFT Id: ${tokenId} of Address: ${address} Burned`);
      } else {
        nftData.set("nft_owner", to);
        const historyData = {
          user,
          amount: "0",
          type: "transfer",
          remark: "",
          NFTData: nftData,
        };
        updateHistory(historyData);

        addUserActivity({
          description: `New NFT Recieved`,
          notifyUser: false,
          ...historyData,
          status: "success",
        });
        logger.info(
          `NFT Id: ${tokenId} Address: ${address} Owner updated to => ${to}`
        );
      }
      await nftData.save(null, { useMasterKey: true });
    }
  } catch (error) {
    logger.error("Vizva token aftersave failed");
    logger.error(error.message);
  }
});

Moralis.Cloud.afterSave("VizvaLToken", async (request) => {
  try {
    const confirmed = request.object.get("confirmed");
    if (confirmed) return;
    const NFTData = Moralis.Object.extend("NFTData");
    const query = new Moralis.Query(NFTData);
    const userQuery = new Moralis.Query("User");
    const creatorQuery = new Moralis.Query("User");
    const ownerQuery = new Moralis.Query("User");
    const from = request.object.get("from");
    const to = request.object.get("to");
    const tokenId = request.object.get("tokenId");
    const address = request.object.get("address");
    const txHash = request.object.get("transaction_hash");
    userQuery.equalTo("ethAddress", to);
    const user = await userQuery.first({ useMasterKey: true });
    if (from == "0x0000000000000000000000000000000000000000") {
      query.equalTo("txHash", "NA");
      query.equalTo("tokenId", tokenId);
      query.equalTo("tokenAddress", address);
      const nftData = await query.first();
      if (!nftData) {
        logger.info(`no nft data found for token Id: ${tokenId}`);
        return;
      }
      logger.info(`New token ${address}:${tokenId} minted to ${to}`);
      nftData.set("tokenId", tokenId);
      nftData.set("txHash", txHash);
      const mintHistory = {
        user,
        amount: "0",
        type: "minted",
        remark: "",
        NFTData: nftData,
      };
      await updateHistory(mintHistory);
      await addUserActivity({
        description: `token Id ${tokenId} of ${address} minted`,
        notifyUser: false,
        ...mintHistory,
        status: "success",
      });
      await nftData.save(null, { useMasterKey: true });
    } else {
      query.equalTo("tokenId", tokenId);
      query.equalTo("tokenAddress", address);
      const nftData = await query.first();
      if (!nftData) {
        logger.info(`no nft data found for token Id: ${tokenId}`);
        return;
      }
      if (to == "0x0000000000000000000000000000000000000000") {
        creatorQuery.equalTo("objectId", nftData.get("createdBy").id);
        ownerQuery.equalTo("ethAddress", nftData.get("nft_owner"));
        const creator = await creatorQuery.first({ useMasterKey: true });
        const owner = await ownerQuery.first({ useMasterKey: true });
        addUserActivity({
          description: `you burned tokenId ${tokenId} of ${address} `,
          notifyUser: false,
          status: "success",
          user: owner,
          amount: "0",
          type: "burn",
          remark: "owner",
          NFTData: nftData,
        });
        if (owner.id != creator.id) {
          addUserActivity({
            description: `The NFT with tokenId ${tokenId} of ${address} that you have created got burned`,
            notifyUser: true,
            status: "success",
            user: creator,
            amount: "0",
            type: "burn",
            remark: "creator",
            NFTData: nftData,
            miscUserinfo: owner,
          });
        }
        nftData.unset("tokenId");
        nftData.unset("saleType");
        nftData.set("nft_owner", to);
        creator.set("nftCreated", creator.get("nftCreated") - 1);
        creator.save(null, { useMasterKey: true });
        logger.info(`NFT Id: ${tokenId} of Address: ${address} Burned`);
      } else {
        nftData.set("nft_owner", to);
        const historyData = {
          user,
          amount: "0",
          type: "transfer",
          remark: "",
          NFTData: nftData,
        };
        updateHistory(historyData);

        addUserActivity({
          description: `New NFT Recieved`,
          notifyUser: false,
          ...historyData,
          status: "success",
        });
        logger.info(
          `NFT Id: ${tokenId} Address: ${address} Owner updated to => ${to}`
        );
      }
      await nftData.save(null, { useMasterKey: true });
    }
  } catch (error) {
    logger.error("Vizva L token aftersave failed");
    logger.error(error.message);
  }
});

Moralis.Cloud.afterSave("VizvaMarketItems", async (request) => {
  try {
    const NFTData = Moralis.Object.extend("NFTData");
    const query = new Moralis.Query(NFTData);
    const userQuery = new Moralis.Query("User");
    const marketId = request.object.get("uid");
    const tokenId = request.object.get("tokenId");
    const address = request.object.get("tokenAddress");
    const txHash = request.object.get("transaction_hash");
    const saleType = request.object.get("saleType");
    const creator = request.object.get("creator");
    query.equalTo("tokenId", tokenId);
    query.equalTo("tokenAddress", address);
    const nftData = await query.first();
    if (nftData) {
      const saleClass = saleType == 2 ? "AuctionData" : "SaleData";
      const Sale = Moralis.Object.extend(saleClass);
      const saleQuery = new Moralis.Query(Sale);
      saleQuery.equalTo("txHash", txHash);
      const saleData = await saleQuery.first();
      // Check if DB already updated or not.If already updated, revert.
      if (saleData.get("marketId") == marketId) {
        return;
      }
      if (!saleData) {
        // checking if the nft is Lazy minted
        const lazySaleQuery = new Moralis.Query(Sale);
        lazySaleQuery.equalTo("nftData", nftData);
        lazySaleQuery.equalTo("marketId", "NA");
        lazySaleQuery.first().then((data) => {
          nftData.set("txHash", txHash);
          data.set("txHash", txHash);
          data.set("marketId", marketId);
          data.save(null, { useMasterKey: true });
        });
        return;
      }
      userQuery.equalTo("ethAddress", creator);
      const user = await userQuery.first({ useMasterKey: true }); //check this
      saleData.set("marketId", marketId);
      saleData.set("status", "active");
      nftData.set("onSale", true);
      nftData.set("saleType", saleType == 2 ? "onAuction" : "onSale");
      const listingHistory = {
        user: user,
        amount: saleType == 2 ? saleData.get("minBid") : saleData.get("price"),
        type: "listed",
        remark: `on ${saleType == 2 ? "auction" : "instant"} sale`,
        NFTData: nftData,
      };
      updateHistory(listingHistory);
      addUserActivity({
        description: `token Id:${nftData.get("tokenId")} of ${nftData.get(
          "tokenAddress"
        )}: added to ${saleType == 2 ? "auction" : "instant"} market for ${
          saleType == 2 ? saleData.get("minBid") : saleData.get("price")
        }`,
        notifyUser: false,
        ...listingHistory,
        status: "success",
      });
      await saleData.save(null, { useMasterKey: true });
      await nftData.save(null, { useMasterKey: true });
    } else {
      logger.info(`no nft data found for marketId: ${marketId}`);
    }
  } catch (error) {
    logger.error("Marketplace aftersave failed");
    logger.error(error.message);
    logger.error(JSON.stringify(error));
  }
});

Moralis.Cloud.afterSave("UserFollow", async (request) => {
  try {
    const followingUserObject = request.object.get("following");
    const followUserObject = request.object.get("follower");
    const followingUserQuery = new Moralis.Query("User");
    const followUserQuery = new Moralis.Query("User");
    followUserQuery.equalTo("objectId", followUserObject.id);
    followUserQuery.select("username");
    const followUser = await followUserQuery.first({ useMasterKey: true });
    followingUserQuery.equalTo("objectId", followingUserObject.id);
    followingUserQuery.select("username");
    const followingUser = await followingUserQuery.first({
      useMasterKey: true,
    });
    addUserActivity({
      description: `You followed ${followingUser.get("username")}`,
      notifyUser: false,
      user: followUserObject,
      amount: "0",
      type: "follow",
      remark: `newFollow`,
      status: "success",
      miscUserinfo: followingUserObject,
    });
    addUserActivity({
      description: `You are followed By ${followUser.get("username")}`,
      notifyUser: true,
      user: followingUserObject,
      amount: "0",
      type: "follow",
      remark: `newFollower`,
      status: "success",
      miscUserinfo: followUserObject,
    });
  } catch (error) {
    logger.error("UserFollow aftersave failed");
    logger.error(error.message);
    logger.error(JSON.stringify(error));
  }
});

Moralis.Cloud.afterSave("UserWishlist", async (request) => {
  try {
    const objectId = request.object.get("NFT").id;
    const queryClass = Moralis.Object.extend("NFTData");
    const query = new Moralis.Query(queryClass);
    const userQuery = new Moralis.Query("User");
    const ownerQuery = new Moralis.Query("User");
    query.equalTo("objectId", objectId);
    const data = await query.first({ useMasterKey: true });
    userQuery.equalTo("objectId", request.object.get("User").id);
    ownerQuery.equalTo("ethAddress", data.get("nft_owner"));
    const user = await userQuery.first({ useMasterKey: true });
    const owner = await ownerQuery.first({ useMasterKey: true });
    addUserActivity({
      description: `You wishlisted ${data.get("metadata").name}`,
      notifyUser: false,
      user: user,
      amount: "",
      type: "wishlist",
      remark: "added",
      status: "success",
      NFTData: data,
    });
    if (user.id != data.get("createdBy").id) {
      addUserActivity({
        description: `${user.get("username")} wishlisted ${
          data.get("metadata").name
        }`,
        notifyUser: true,
        user: data.get("createdBy"),
        amount: "",
        type: "wishlist",
        remark: "addedNFTCreator",
        status: "success",
        NFTData: data,
        miscUserinfo: user,
      });
    }
    if (user.id != owner.id && data.get("createdBy").id != owner.id) {
      addUserActivity({
        description: `${user.get("username")} wishlisted ${
          data.get("metadata").name
        }`,
        notifyUser: true,
        user: owner,
        amount: "",
        type: "wishlist",
        remark: "addedNFTOwner",
        status: "success",
        NFTData: data,
        miscUserinfo: user,
      });
    }
  } catch (error) {
    logger.error("wishlist aftersave failed");
    logger.error(error.message);
  }
});

Moralis.Cloud.afterSave("UserLikes", async (request) => {
  try {
    const likeClass = request.object.get("likeClass");
    const likeObjectId = request.object.get("likeObjectId");
    const queryClass = Moralis.Object.extend(likeClass);
    const query = new Moralis.Query(queryClass);
    const userQuery = new Moralis.Query("User");
    const ownerQuery = new Moralis.Query("User");
    query.equalTo("objectId", likeObjectId);
    const data = await query.first({ useMasterKey: true });
    userQuery.equalTo("objectId", request.object.get("User").id);
    ownerQuery.equalTo("ethAddress", data.get("nft_owner"));
    const user = await userQuery.first({ useMasterKey: true });
    const owner = await ownerQuery.first({ useMasterKey: true });
    if (likeClass == "NFTData") {
      addUserActivity({
        description: `You liked ${data.get("metadata").name}`,
        notifyUser: false,
        user: user,
        amount: "",
        type: "like",
        remark: "likedNFTLiker",
        status: "success",
        NFTData: data,
      });
      if (user.id != data.get("createdBy").id) {
        addUserActivity({
          description: `${user.get("username")} liked ${
            data.get("metadata").name
          }`,
          notifyUser: true,
          user: data.get("createdBy"),
          amount: "",
          type: "like",
          remark: "likedNFTCreator",
          status: "success",
          NFTData: data,
          miscUserinfo: user,
        });
      }
      if (user.id != owner.id && data.get("createdBy").id != owner.id) {
        addUserActivity({
          description: `${user.get("username")} liked ${
            data.get("metadata").name
          }`,
          notifyUser: true,
          user: owner,
          amount: "",
          type: "like",
          remark: "likedNFTOwner",
          status: "success",
          NFTData: data,
          miscUserinfo: user,
        });
      }
    }
  } catch (error) {
    logger.error("userlike aftersave failed");
    logger.error(error.message);
    logger.error(JSON.stringify(error));
  }
});

Moralis.Cloud.beforeSaveFile(async (request) => {
  const allowedFileTypes = [
    "image/png",
    "image/gif",
    "image/webp",
    "image/jpg",
    "image/jpeg",
    "video/mp4",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/mpeg",
    "text/plain",
  ];
  const type = request.headers["content-type"];
  const allowed = allowedFileTypes.includes(type);
  if (!allowed) {
    logger.error(
      `${request.user.id} uploaded an unsupported file type ${type} `
    );
    throw new Error("unsupported file upload");
  }
});
