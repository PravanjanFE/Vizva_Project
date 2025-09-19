// Contains setters and services

const logger = Moralis.Cloud.getLogger();

// Cloud function to fetch JSON data from URI.
// this will help to avoid CORS error.
Moralis.Cloud.define("fetchJSON", async (request) => {
  try {
    return Moralis.Cloud.httpRequest({
      method: "GET",
      url: request.params.url,
    });
  } catch (error) {
    logger.error(`fetch JSON error: ${error.message}`);
    logger.error(JSON.stringify(error));
  }
});

// Cloud function to search Artwork, Users & Collections by Keyword
Moralis.Cloud.define(
  "searchByKeyword",
  async (request) => {
    try {
      const keyword = request.params.keyword || "";
      const filter = request.params.filter || "";
      // if empty keyword, bail early
      if (!keyword) return;
      if (filter == "artwork") {
        // search keyword in NFTData class
        const query_metadata_title = new Moralis.Query("NFTData");
        query_metadata_title.matches("metadata.name", keyword, "i");
        const query_metadata_tags = new Moralis.Query("NFTData");
        query_metadata_tags.matches("metadata.tags", keyword, "i");
        const query_metadata_description = new Moralis.Query("NFTData");
        query_metadata_description.matches(
          "metadata.description",
          keyword,
          "i"
        );
        const artwork_query = Moralis.Query.or(
          query_metadata_tags,
          query_metadata_title,
          query_metadata_description
        );
        artwork_query.select(
          "minted",
          "size",
          "objectId",
          "onSale",
          "voucher",
          "tokenURI",
          "tokenId",
          "tokenAddress",
          "saleType",
          "nft_owner",
          "views",
          "metadata",
          "createdBy.username",
          "createdBy.name",
          "createdBy.profilePic"
        );
        artwork_query.limit(100);
        const results_query = await artwork_query.find({ useMasterKey: true });
        const result = [];
        // for each result, get the price from SaleData class and add it to the result
        for (let i = 0; i < results_query.length; i++) {
          const artwork = results_query[i];
          const saleType = artwork.get("saleType");
          let artworkObject = JSON.parse(JSON.stringify(artwork));
          if (saleType == "onSale") {
            // get SaleData object from SaleData class
            const saleDataQuery = new Moralis.Query("SaleData");
            saleDataQuery.equalTo("nftData", artwork);
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
            auctionDataQuery.equalTo("nftData", artwork);
            auctionDataQuery.select(
              "minBid",
              "currency",
              "status",
              "highestBid"
            );
            const auctionDataQueryResult = await auctionDataQuery.first({
              useMasterKey: true,
            });
            if (auctionDataQueryResult) {
              artworkObject.minBid = auctionDataQueryResult.get("minBid");
              artworkObject.highestBid =
                auctionDataQueryResult.get("highestBid");
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
          result.push(artworkObject);
        }
        return result;
        // return results_query;
      } else if (filter == "artist" || filter == "") {
        // search keyword in user class
        const query_username = new Moralis.Query("User");
        query_username.matches("username", keyword, "i");
        const query_name = new Moralis.Query("User");
        query_name.matches("name", keyword, "i");
        const user_query = Moralis.Query.or(query_username, query_name);
        user_query.select(
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
          "ethAddress"
        );
        user_query.limit(100);
        const queryResults = await user_query.find({ useMasterKey: true });
        const result = [];

        for (let i = 0; i < queryResults.length; i++) {
          const user = queryResults[i];
          let userObject = JSON.parse(JSON.stringify(user));

          if (request.user && request.user.id != user.objectId) {
            // Check if request user is following the user
            const followerQuery = new Moralis.Query("UserFollow");
            followerQuery.equalTo("follower", request.user);
            followerQuery.equalTo("following", user);
            const followerQueryResult = await followerQuery.first({
              useMasterKey: true,
            });
            if (followerQueryResult) {
              userObject.isFollowing = true;
            } else {
              userObject.isFollowing = false;
            }

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

          // Get the follower and following count and add it to the user object
          const userFollowQuery = new Moralis.Query("UserFollow");
          userFollowQuery.equalTo("follower", user);
          const followerCount = (await userFollowQuery.find()).length;
          const UserFollowingQuery = new Moralis.Query("UserFollow");
          UserFollowingQuery.equalTo("following", user);
          const followingCount = (await UserFollowingQuery.find()).length;
          userObject.following = followerCount;
          userObject.followers = followingCount;

          // get the nftcreated count of user
          const NFTQuery = new Moralis.Query("NFTData");
          NFTQuery.equalTo("createdBy", user);
          NFTQuery.exists("tokenId");
          const nftCount = (await NFTQuery.find()).length;
          userObject.nftCreated = nftCount;
          result.push(userObject);
        }
        return result;
      } else if (filter == "collection") {
        // search keyword in collection class
        // Commented out as there's no collection class in db right now. uncomment when there is
        let results = [];
        const query_collection = new Moralis.Query("Collection");
        const NFTQuery = new Moralis.Query("NFTData");
        query_collection.matches("name", keyword, "i");
        query_collection.descending("createdAt");
        const collections = await query_collection.find({ useMasterKey: true });
        for (let i = 0; i < collections.length; i++) {
          NFTQuery.equalTo("collection", collections[i]);
          NFTQuery.select(
            "minted",
            "size",
            "objectId",
            "onSale",
            "tokenURI",
            "tokenId",
            "tokenAddress",
            "saleType",
            "nft_owner",
            "views",
            "metadata",
            "createdBy.username",
            "createdBy.name",
            "createdBy.profilePic"
          );
          const NFTData = await NFTQuery.find({ useMasterKey: true });
          results.push(...NFTData);
        }
        return results;
        // return [];
      }
      return [];
    } catch (error) {
      logger.error("search by keyword failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
    }
  },
  {
    fields: ["keyword", "filter"],
  }
);

/*
Cloud function to report a user or NFT in UserReports class
type : user, nft, blog, comment, collection
reported : objectId of user, nft, blog, comment, collection
subject : Violent or Graphic Content etc...
description : user's description of the report
*/
Moralis.Cloud.define("reportThis",
  async (request) => {
    try {
      if (!request.user) {
        return { success: false, message: "You must be logged in to report" };
      }
      // if report exists with reportedBy and reported, then return
      const reportQuery = new Moralis.Query("UserReports");
      reportQuery.equalTo("reportedBy", request.user);
      reportQuery.equalTo("reported", request.params.reported);
      const reportQueryResult = await reportQuery.first({ useMasterKey: true });
      if (reportQueryResult) {
        return { success: false, message: "Report already exists" };
      }
      // create a new report
      const report = new Moralis.Object("UserReports");
      report.set("type", request.params.type);
      report.set("reported", request.params.reported);
      report.set("reportedBy", request.user);
      report.set("subject", request.params.subject);
      report.set("url", request.params.url);
      report.set("details", request.params.details);
      await report.save({ useMasterKey: true });
      return { success: true, message: "Report submitted" };
    } catch (error) {
      logger.error("report failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
      return { success: false };
    }
  }, {
  requireUser: true,
  fields: ["type", "reported", "subject", "url", "details"],
}
);

// Cloud function for Creating New NFT Data
Moralis.Cloud.define(
  "createNewNFTData",
  async (request) => {
    try {
      const NFTClass = Moralis.Object.extend("NFTData");
      const nftQuery = new Moralis.Query(NFTClass);
      const NFTData = new Moralis.Object("NFTData");
      const query = new Moralis.Query("Collection");
      const userQuery = new Moralis.Query("User");
      const {
        size,
        tokenAddress,
        tokenId,
        tokenURI,
        metadata,
        minted,
        tags = [],
        voucher = {},
        txHash,
        digitalKey = "",
      } = request.params;
      if (minted) {
        nftQuery.equalTo("txHash", txHash);
        const nftData = await nftQuery.first({ useMasterKey: true });
        if (nftData) {
          throw new Error("nft data already exist on db");
        }
      } else {
        nftQuery.equalTo("tokenAddress", tokenAddress);
        nftQuery.equalTo("tokenId", tokenId);
        const nftData = await nftQuery.first({ useMasterKey: true });
        if (nftData) {
          throw new Error("nft data already exist on db");
        }
      }
      const ethAddress = request.user.attributes.ethAddress;
      const vizva = await query.first(); // for now every NFT created will be vizva collection
      const NFTObject = await NFTData.save(
        {
          size,
          tokenAddress: tokenAddress.toLowerCase(),
          tokenId,
          tokenURI,
          metadata,
          minted,
          voucher,
          onSale: false,
          saleType: "inactive",
          tags,
          createdBy: request.user,
          nft_owner: ethAddress,
          digitalKey,
          views: 0,
          collection: vizva,
          txHash,
        },
        { useMasterKey: true }
      );
      userQuery.equalTo("objectId", request.user.id);
      const user = await userQuery.first({ useMasterKey: true });
      user.set("nftCreated", user.get("nftCreated") + 1);
      user.save(null, { useMasterKey: true });
      if (!minted) {
        const mintHistory = {
          user: request.user,
          amount: "0",
          type: "lazyminted",
          remark: "voucher created",
          NFTData: NFTObject,
        };
        await updateHistory(mintHistory);
        await addUserActivity({
          description: `token Id: ${tokenId} of ${tokenAddress} lazy minted`,
          notifyUser: false,
          ...mintHistory,
          status: "success",
        });
      }
      return NFTObject;
    } catch (error) {
      logger.error("create new NFT data failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
      throw new Error("NFT data upload failed");
    }
  },
  {
    requireUser: true,
    fields: [
      "size",
      "tokenAddress",
      "tokenURI",
      "metadata",
      "minted",
      "txHash",
    ],
  }
);

Moralis.Cloud.define(
  "createSaleData",
  async (request) => {
    try {
      const { price, marketId, nftId, currency, txHash } = request.params;
      const NFTData = Moralis.Object.extend("NFTData");
      const query = new Moralis.Query(NFTData);
      query.equalTo("objectId", nftId);
      const nftData = await query.first();
      if (nftData.get("nft_owner") == request.user.attributes.ethAddress) {
        const SaleData = new Moralis.Object("SaleData");
        const saleDataObject = await SaleData.save(
          {
            status: marketId == "NA" ? "active" : "pending",
            price,
            marketId,
            nftData,
            buyer: "0x00",
            currency,
            createdBy: request.user,
            txHash,
          },
          { useMasterKey: true }
        );
        if (marketId == "NA") {
          nftData.set("onSale", true);
          nftData.set("saleType", "onSale");
          await nftData.save(null, { useMasterKey: true });
          const listingHistory = {
            user: request.user,
            amount: price,
            type: "listed",
            remark: "on instant sale",
            NFTData: nftData,
          };
          updateHistory(listingHistory);
          addUserActivity({
            description: `Lazy token Id: ${nftData.get(
              "tokenId"
            )} of ${nftData.get(
              "tokenAddress"
            )} added to instant market for ${price}`,
            notifyUser: false,
            ...listingHistory,
            status: "success",
          });
        }
        return saleDataObject;
      }
      throw new Error("un-authorized action");
    } catch (error) {
      logger.error("create sale data failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
      throw new Error("saving sale data failed");
    }
  },
  {
    fields: ["price", "marketId", "nftId", "currency"],
    requireUser: true,
  }
);

Moralis.Cloud.define(
  "createAuctionData",
  async (request) => {
    try {
      const { minBid, marketId, nftId, endTime, currency, txHash } =
        request.params;
      const NFTData = Moralis.Object.extend("NFTData");
      const query = new Moralis.Query(NFTData);
      query.equalTo("objectId", nftId);
      const nftData = await query.first();
      if (nftData.get("nft_owner") == request.user.attributes.ethAddress) {
        const SaleData = new Moralis.Object("AuctionData");
        const saleDataObject = await SaleData.save(
          {
            status: "pending",
            minBid,
            marketId,
            nftData,
            endTime,
            currency,
            highestBid: minBid,
            createdBy: request.user,
            txHash,
          },
          { useMasterKey: true }
        );
        return saleDataObject;
      }
      throw new Error("un-authorized action");
    } catch (error) {
      logger.error("create auction data failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
      throw new Error("saving sale data failed");
    }
  },
  {
    fields: ["minBid", "marketId", "nftId", "endTime", "currency"],
    requireUser: true,
  }
);

// use to save verification data on database
Moralis.Cloud.define(
  "saveVerificationData",
  async (request) => {
    try {
      const {
        bio,
        twitter,
        instagram,
        rarible,
        email,
        ethAddress,
        portfolio,
        type,
        previousWork,
      } = request.params;
      const verificationData = new Moralis.Object("VerificationData");
      await verificationData.save(
        {
          bio,
          twitter,
          instagram,
          rarible,
          email,
          ethAddress,
          portfolio,
          type,
          previousWork,
          user: request.user,
          status: "pending", // pending, approved, rejected
        },
        { useMasterKey: true }
      );
      return true;
    } catch (error) {
      logger.error("saving verificationData failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
      throw new Error("error saving data");
    }
  },
  {
    requireUser: true,
  }
);

// Cloud function to add an NFT to wishlist
Moralis.Cloud.define(
  "addToWishlist",
  async (request) => {
    try {
      const user = request.user;
      const nftId = request.params.nftId; // object ID of NFT
      // get NFT object from NFT Data by objectid
      const nftQuery = new Moralis.Query("NFTData");
      nftQuery.equalTo("objectId", nftId);
      const nftQueryResult = await nftQuery.first({ useMasterKey: true });
      if (!nftQueryResult) return { saved: false, error: "Artwork not found" }; // bail early if artwork is not found
      // check if nft is already in wishlist
      const wishlistQuery = new Moralis.Query("UserWishlist");
      wishlistQuery.equalTo("User", user);
      wishlistQuery.equalTo("NFT", nftQueryResult);
      const wishlistQueryResult = await wishlistQuery.first({
        useMasterKey: true,
      });
      if (wishlistQueryResult) {
        // item already in wishlist
        return {
          saved: false,
          error: "Already in wishlist",
        };
      } else {
        const userWishlist = new Moralis.Object("UserWishlist");
        userWishlist.set("User", user);
        userWishlist.set("NFT", nftQueryResult);
        await userWishlist.save(null, { useMasterKey: true });
        return {
          saved: true,
          success: true,
        };
      }
    } catch (error) {
      logger.error("add to wishlist failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
    }
  },
  {
    fields: ["nftId"],
    requireUser: true,
  }
);

// Cloud function remove an item from wishlist
Moralis.Cloud.define(
  "removeFromWishlist",
  async (request) => {
    try {
      const user = request.user;
      const nftId = request.params.nftId; // object ID of NFT
      // get NFT object from NFT Data by objectid
      const nftQuery = new Moralis.Query("NFTData");
      nftQuery.equalTo("objectId", nftId);
      const nftQueryResult = await nftQuery.first({ useMasterKey: true });
      if (!nftQueryResult)
        return { removed: false, error: "Artwork not found" }; // bail early if artwork is not found
      // check if nft is already in wishlist
      const wishlistQuery = new Moralis.Query("UserWishlist");
      wishlistQuery.equalTo("User", user);
      wishlistQuery.equalTo("NFT", nftQueryResult);
      const wishlistQueryResult = await wishlistQuery.first({
        useMasterKey: true,
      });
      if (!wishlistQueryResult) {
        // item not in wishlist
        return {
          removed: false,
          error: "Not in wishlist",
        };
      } else {
        await wishlistQueryResult.destroy({ useMasterKey: true });
        addUserActivity({
          description: `An NFT removed from your wishlist`,
          notifyUser: false,
          user: request.user,
          amount: "",
          type: "wishlist",
          remark: "removed",
          NFTData: nftQueryResult,
          status: "success",
        });
        return {
          removed: true,
          success: true,
        };
      }
    } catch (error) {
      logger.error("remove from wishlist failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
    }
  },
  {
    fields: ["nftId"],
    requireUser: true,
  }
);

// Cloud function to save user likes in UserLikes class.
// User object stored as User. likeClass stored as "NFTData" or "User", where "likeObjectId" is the objectId of the NFT or User liked
// Params: User, likeClass & likeObjectId of the liked NFT or user
Moralis.Cloud.define(
  "userLike",
  async (request) => {
    try {
      const user = request.user;
      const likeClass = request.params.likeClass;
      const likeObjectId = request.params.likeObjectId;
      // if user, likeClass or likeObjectId is empty, bail early
      if (!user || !likeClass || !likeObjectId) return false;
      // check if a row with user, type and object already exists in UserLikes class
      const userLikesQuery = new Moralis.Query("UserLikes");
      userLikesQuery.equalTo("User", user);
      userLikesQuery.equalTo("likeClass", likeClass);
      userLikesQuery.equalTo("likeObjectId", likeObjectId);
      const userLikesObject = await userLikesQuery.first({
        useMasterKey: true,
      });
      if (userLikesObject) {
        // user has already liked the object
        return true; // true because we're setting the state like to true on frontend from the result of this function
      } else {
        // if row doesn't exist, create it
        const userLikes = new Moralis.Object("UserLikes");
        userLikes.set("User", user);
        userLikes.set("likeClass", likeClass);
        userLikes.set("likeObjectId", likeObjectId);
        await userLikes.save(null, { useMasterKey: true });
        return true;
      }
    } catch (error) {
      logger.error("user like failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
    }
  },
  {
    fields: ["likeClass", "likeObjectId"],
    requireUser: true,
  }
);

// Cloud function to Unlike and remove user like in UserLikes class.
// Params: User, likeClass & likeObjectId of the liked NFT or user
Moralis.Cloud.define(
  "userUnlike",
  async (request) => {
    try {
      const user = request.user;
      const likeClass = request.params.likeClass;
      const likeObjectId = request.params.likeObjectId;
      // check if a row with user, type and object already exists in UserLikes class
      const userLikesQuery = new Moralis.Query("UserLikes");
      userLikesQuery.equalTo("User", user);
      userLikesQuery.equalTo("likeClass", likeClass);
      userLikesQuery.equalTo("likeObjectId", likeObjectId);
      const userLikesObject = await userLikesQuery.first({
        useMasterKey: true,
      });
      if (userLikesObject) {
        const queryClass = Moralis.Object.extend(likeClass);
        const query = new Moralis.Query(queryClass);
        query.equalTo("objectId", likeObjectId);
        const data = await query.first({ useMasterKey: true });
        await userLikesObject.destroy({ useMasterKey: true }); // unliked the object
        if (likeClass == "NFTData") {
          addUserActivity({
            description: `You un-liked ${data.get("metadata").name}`,
            notifyUser: false,
            user: user,
            amount: null,
            type: "like",
            remark: `unlikedNFT`,
            status: "success",
            NFTData: data,
          });
        }
        return false; // false because we're setting the state like to false on frontend from the result of this function
      }
    } catch (error) {
      logger.error("user unlike failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
    }
  },
  {
    fields: ["likeClass", "likeObjectId"],
    requireUser: true,
  }
);

// ** Commented out as this function isnt required on the frontend right now. Uncomment & modify when required **
// Get user likes in UserLikes class.
// Params: User
// Moralis.Cloud.define("getUserLikes", async (request) => {
//   try {
//     const user = request.user;
//     if (!user) return false;
//     // check if a row with user, type and object already exists in UserLikes class
//     const userLikesQuery = new Moralis.Query("UserLikes");
//     userLikesQuery.equalTo("User", user);
//     userLikesQuery.select(["likeClass", "likeObjectId"]);
//     const userLikesObjects = await userLikesQuery.find({ useMasterKey: true });
//     return userLikesObjects;
//   } catch (error) {
//     logger.error(error.message);
//   }
// }, {
//   requireUser: true
// });

// Cloud function to follow a user. user id of follower and user id of following is passed as params.
// Follower is the one requesting, Following is the one being followed/unfollowed
Moralis.Cloud.define(
  "followUser",
  async (request) => {
    try {
      const followingId = request.params.followingId;
      // User trying to follow himself
      if (followingId == request.user.id)
        return "You cannot follow yourself champ!";

      const followUserQuery = new Moralis.Query("User");
      followUserQuery.equalTo("objectId", request.user.id);
      const followUserObject = await followUserQuery.first({
        useMasterKey: true,
      });

      const followingUserQuery = new Moralis.Query("User");
      followingUserQuery.equalTo("objectId", followingId);
      const followingUserObject = await followingUserQuery.first({
        useMasterKey: true,
      });

      const followData = new Moralis.Query("UserFollow");
      followData.equalTo("follower", followUserObject);
      followData.equalTo("following", followingUserObject);
      const followDataResults = await followData.find({ useMasterKey: true });
      if (followDataResults.length > 0) {
        // user is already following this user
        return "Already Following";
      } else {
        const followDataObject = new Moralis.Object("UserFollow");
        followDataObject.set("follower", followUserObject);
        followDataObject.set("following", followingUserObject);
        await followDataObject.save(null, { useMasterKey: true });
        return "Followed";
      }
    } catch (error) {
      logger.error("follow user failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
    }
  },
  {
    fields: ["followingId"],
    requireUser: true,
  }
);

// Cloud function to unfollow a user. User id of follower and user id of following is passed as params. Follower is the one requesting, Following is the one being followed/unfollowed
Moralis.Cloud.define(
  "unfollowUser",
  async (request) => {
    try {
      const followingId = request.params.followingId;
      // User trying to unfollow himself
      if (followingId == request.user.id)
        return "You cannot unfollow yourself! Wait.... How did you follow yourself in the first place?";

      const followUserQuery = new Moralis.Query("User");
      followUserQuery.equalTo("objectId", request.user.id);
      const followUserObject = await followUserQuery.first({
        useMasterKey: true,
      });

      const followingUserQuery = new Moralis.Query("User");
      followingUserQuery.equalTo("objectId", followingId);
      const followingUserObject = await followingUserQuery.first({
        useMasterKey: true,
      });

      const followData = new Moralis.Query("UserFollow");
      followData.equalTo("follower", followUserObject);
      followData.equalTo("following", followingUserObject);
      const followDataResults = await followData.find({ useMasterKey: true });
      if (followDataResults.length > 0) {
        Moralis.Object.destroyAll(followDataResults, { useMasterKey: true }); //unfollowed user
        addUserActivity({
          description: `You unfollowed ${followingUserObject.get("username")}`,
          notifyUser: false,
          user: followUserObject,
          amount: "0",
          type: "follow",
          remark: `unFollow`,
          status: "success",
          miscUserinfo: followingUserObject,
        });
        return "unfollowed";
      } else {
        return "Not Following";
      }
    } catch (error) {
      logger.error("unfollow user failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
    }
  },
  {
    fields: ["followingId"],
    requireUser: true,
  }
);

Moralis.Cloud.define(
  "updateSalePrice",
  async (request) => {
    try {
      const saleId = request.params.id;
      const salePrice = request.params.salePrice;
      const SaleData = Moralis.Object.extend("SaleData");
      const query = new Moralis.Query(SaleData);
      query.equalTo("objectId", saleId);
      const saleData = await query.first();
      if (saleData.get("createdBy").id != request.user.id)
        throw new Error("un-authorized action");
      if (parseInt(saleData.price) < parseInt(salePrice)) {
        throw new Error("new price should be less than previous price");
      }
      saleData.set("price", salePrice);
      const historyData = {
        user: request.user,
        amount: salePrice,
        type: "salePriceUpdate",
        remark: "",
        NFTData: saleData.get("nftData"),
      };
      updateHistory(historyData);
      addUserActivity({
        description: `NFT sale price updated`,
        notifyUser: false,
        ...historyData,
        status: "success",
      });
      saleData.save(null, { useMasterKey: true });
      logger.info(`Sale Id: ${saleId} sale price updated to ${salePrice}`);
      return true;
    } catch (error) {
      logger.error("update saleprice failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
      throw new Error(`Updating price failed: ${error.message}`);
    }
  },
  {
    fields: ["id", "salePrice"],
    requireUser: true,
  }
);
// Cloud function to process the insant sale of an NFT
Moralis.Cloud.define(
  "processInstantSale",
  async (request) => {
    try {
      const SaleData = Moralis.Object.extend("SaleData");
      const NFTData = Moralis.Object.extend("NFTData");
      const userQuery = new Moralis.Query(Moralis.User);
      const query = new Moralis.Query(SaleData);
      const nftQuery = new Moralis.Query(NFTData);
      const userData = request.user.attributes;
      const userAddress = userData.ethAddress;
      const ID = request.params.Id || 0;
      const amount = request.params.amount;
      query.equalTo("objectId", ID);
      const data = await query.first();
      data.set("status", "completed");
      data.set("buyer", userAddress);
      const nftData = data.get("nftData");
      nftQuery.equalTo("objectId", nftData.id);
      const _nftdata = await nftQuery.first();
      const oldOwnerAddress = _nftdata.get("nft_owner");
      userQuery.equalTo("ethAddress", oldOwnerAddress);
      const oldOwner = await userQuery.first({ useMasterKey: true });
      const minted = _nftdata.get("minted");
      _nftdata.set("onSale", false);
      _nftdata.set("saleType", "inactive");
      _nftdata.set("nft_owner", userAddress);
      if (!minted) {
        _nftdata.set("minted", true);
      }
      const historyData = {
        user: request.user,
        amount,
        type: "NFTPurchase",
        remark: "",
        NFTData: nftData,
      };
      updateHistory(historyData);

      // add activity of buyer
      addUserActivity({
        description: `New NFT purchase through instant sale`,
        notifyUser: false,
        ...historyData,
        status: "success",
        miscUserinfo: oldOwner,
        remark: "buy",
      });

      //notify seller
      addUserActivity({
        description: `NFT instant sale completed`,
        notifyUser: true,
        user: oldOwner,
        amount,
        type: "NFTPurchase",
        remark: "sell",
        NFTData: nftData,
        status: "success",
        miscUserinfo: request.user,
      });
      _nftdata.save(null, { useMasterKey: true });
      logger.info(
        `NFT on sale with saleId: ${ID} purchased by ${userAddress} from InstantSale`
      );
      data.save(null, { useMasterKey: true });
      return true;
    } catch (error) {
      logger.error("process instant sale failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
      return false;
    }
  },
  {
    fields: ["Id", "amount"],
    requireUser: true,
  }
);

// Cloud function to check and accept bid on an NFT
Moralis.Cloud.define(
  "checkAndAcceptBid",
  async (request) => {
    try {
      const AuctionData = Moralis.Object.extend("AuctionData");
      const Bids = new Moralis.Object("Bids");
      const query = new Moralis.Query(AuctionData);
      const ID = request.params.Id || 0;
      const { signedVoucher } = request.params.voucher;
      query.equalTo("objectId", ID);
      const auction = await query.first();
      const endTime = auction.get("endTime");
      if (auction.get("minBid") > signedVoucher.bid) {
        throw new Error("bid should be greater than minimum bid");
      }
      if (auction.get("status") != "active") {
        throw new Error("inactive sale");
      }
      if (endTime < new Date()) {
        throw new Error("auction already ended");
      }
      if (parseInt(signedVoucher.bid) > parseInt(auction.get("highestBid"))) {
        if (endTime - new Date() < 600000) {
          const newTime = new Date(endTime.getTime() + 600000);
          auction.set("endTime", newTime);
        }
        auction.set("highestBid", signedVoucher.bid);
        await auction.save(null, { useMasterKey: true });
        await Bids.save(
          {
            bidder: request.user,
            signedVoucher,
            auction,
            status: "active",
          },
          { useMasterKey: true }
        );
      } else {
        await Bids.save(
          {
            bidder: request.user,
            signedVoucher,
            auction,
            status: "outBidded",
          },
          { useMasterKey: true }
        );
      }
      const nftData = auction.get("nftData");
      const historyData = {
        user: request.user,
        amount: signedVoucher.bid,
        type: "bid",
        remark: "bidPlaced",
        NFTData: nftData,
      };
      updateHistory(historyData);

      // add activity of bidder
      addUserActivity({
        description: `Bid Placed on auction ${ID}`,
        notifyUser: false,
        ...historyData,
        status: "success",
      });

      //this is to notify auction creator.
      addUserActivity({
        user: auction.get("createdBy"),
        amount: signedVoucher.bid,
        type: "bid",
        remark: "newBid",
        NFTData: nftData,
        description: `Your NFT got a new bid on auction ${ID} `,
        notifyUser: true,
        status: "success",
        miscUserinfo: request.user,
      });
      logger.info(`new Bid: ${signedVoucher.bid} added to ${ID} `);
      return auction.save(null, { useMasterKey: true });
    } catch (error) {
      logger.error("accepting bid failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
      throw new Error(`accepting bid failed: ${error.message}`);
    }
  },
  {
    fields: ["Id", "voucher"],
    requireUser: true,
  }
);

Moralis.Cloud.define("withdrawBid", async (request) => {
  try {
    const bidId = request.params.bidId;
    const Bids = Moralis.Object.extend("Bids");
    const query = new Moralis.Query(Bids);
    query.equalTo("objectId", bidId);
    const bid = await query.first({ useMasterKey: true });
    const bidder = bid.get("bidder");
    if (bidder.id == request.user.id) {
      bid.set("status", "bidCancelled");
      await bid.save(null, { useMasterKey: true });
    } else {
      throw new Error("only the bidder is allowed to withdraw bid");
    }
    return true;
  } catch (error) {
    logger.error("withdraw bid failed");
    logger.error(error.message);
    logger.error(JSON.stringify(error));
    throw new Error("cancel bid failed");
  }
});

// function to finalize the selected bid.
// function params id, amount, heighestBid
Moralis.Cloud.define(
  "finalizeBid",
  async (request) => {
    try {
      const { ID, amount, highestBidId, winner } = request.params;
      const AuctionData = Moralis.Object.extend("AuctionData");
      const NFTData = Moralis.Object.extend("NFTData");
      const Bids = new Moralis.Object("Bids");
      const query = new Moralis.Query(AuctionData);
      const nftQuery = new Moralis.Query(NFTData);
      const bidsQuery = new Moralis.Query(Bids);
      const userQuery = new Moralis.Query(Moralis.User);
      const userAddress = winner.toLowerCase();
      userQuery.equalTo("ethAddress", userAddress);
      const userData = await userQuery.first({ useMasterKey: true });
      query.equalTo("objectId", ID);
      const data = await query.first();
      if (data.get("createdBy").id != request.user.id)
        throw new Error("un-authorized action");
      data.set("status", "completed");
      data.set("buyer", userAddress);
      const nftData = data.get("nftData");
      nftQuery.equalTo("objectId", nftData.id);
      const _nftdata = await nftQuery.first();
      _nftdata.set("onSale", false);
      _nftdata.set("saleType", "inactive");
      _nftdata.set("nft_owner", userAddress);
      const historyData = {
        user: userData,
        amount,
        type: "auctionWon",
        remark: "bidAccepted",
        NFTData: _nftdata,
      };
      updateHistory(historyData);
      addUserActivity({
        description: `Bid finalized: ${highestBidId}`,
        notifyUser: false,
        user: request.user,
        amount,
        type: "bid",
        remark: "bidAccepted",
        status: "success",
        NFTData: _nftdata,
      });
      bidsQuery.equalTo("objectId", highestBidId);
      const bidData = await bidsQuery.first();

      //notify the bidder
      addUserActivity({
        description: `Bid finalized  ${highestBidId}`,
        notifyUser: true,
        user: bidData.get("bidder"),
        amount,
        type: "bid",
        remark: "bidWon",
        status: "success",
        NFTData: _nftdata,
        miscUserinfo: request.user,
      });
      bidData.set("status", "finalized");
      await data.save(null, { useMasterKey: true });
      await _nftdata.save(null, { useMasterKey: true });
      await bidData.save(null, { useMasterKey: true });
      logger.info(
        `NFT on sale with saleId: ${ID} purchased by ${userAddress} from Auction`
      );
      return true;
    } catch (error) {
      logger.error("finalize bid failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
      return false;
    }
  },
  {
    fields: ["ID", "amount", "highestBidId", "winner"],
    requireUser: true,
  }
);

Moralis.Cloud.define(
  "cancelSale",
  async (request) => {
    try {
      let SaleClass;
      const saleType = request.params.saleType;
      const ID = request.params.Id || 0;
      const NFTData = Moralis.Object.extend("NFTData");
      if (saleType == "onAuction") {
        SaleClass = Moralis.Object.extend("AuctionData");
      } else if (saleType == "onSale") {
        SaleClass = Moralis.Object.extend("SaleData");
      } else {
        throw new Error("unknown sale type");
      }
      const SaleData = Moralis.Object.extend(SaleClass);
      const query = new Moralis.Query(SaleData);
      const nftQuery = new Moralis.Query(NFTData);
      const userData = request.user.attributes;
      const userAddress = userData.ethAddress;
      query.equalTo("objectId", ID);
      const data = await query.first();
      if (data.get("createdBy").id != request.user.id) {
        throw new Error("un-authorized action");
      }
      data.set("status", "cancelled");
      const nftData = data.get("nftData");
      nftQuery.equalTo("objectId", nftData.id);
      const _nftdata = await nftQuery.first();
      const minted = _nftdata.get("minted");
      if (!minted) _nftdata.set("voucher", {});
      _nftdata.set("onSale", false);
      _nftdata.set("saleType", "inactive");
      Moralis.bulkUpdateMany("Bids", [
        // prettier-ignore
        {
          filter: { "auction.id": ID, "status": "active" },
          update: { "status": "saleCancelled" },
        },
      ]);
      const historyData = {
        user: request.user,
        amount: "0",
        type: "cancel",
        remark: `nft sale cancelled`,
        NFTData: nftData,
      };
      updateHistory(historyData);

      addUserActivity({
        description: `NFT Sale cancelled`,
        notifyUser: false,
        ...historyData,
        status: "success",
      });
      await _nftdata.save(null, { useMasterKey: true });
      await data.save(null, { useMasterKey: true });
      logger.info(`NFT on sale with saleId: ${ID} cancelled by ${userAddress}`);
      return true;
    } catch (error) {
      logger.error("cancel sale failed");
      logger.error(error.message);
      logger.error(JSON.stringify(error));
      throw new Error(error.message);
    }
  },
  {
    fields: ["saleType", "Id"],
    requireUser: true,
  }
);

Moralis.Cloud.define(
  "joinWaitlist",
  async (request) => {
    try {
      const { email, walletAddress, token } = request.params;
      let isRecaptchaValid = false;
      // check if recaptcha is valid
      const recaptcha_secret = "6LdqMXkgAAAAAFrfN5FbZzXHbVyWMMzRoaIuK1EK";
      const response = await Moralis.Cloud.httpRequest({
        url: "https://www.google.com/recaptcha/api/siteverify",
        params: {
          secret: recaptcha_secret,
          response: token,
        },
      }).then(
        function (httpResponse) {
          //logger.info(JSON.stringify(httpResponse));
          isRecaptchaValid = httpResponse.data.success;
        },
        function (httpResponse) {
          logger.error(
            "Recaptcha API call failed in joinWaitlist with response code " +
            httpResponse.status
          );
        }
      );

      if (!isRecaptchaValid) {
        throw new Error(
          "Recaptcha check failed. We don't talk to bots, humans are just better."
        );
        return false;
      }

      // throw new Error("no more waitlist allowed");
      const inviteCodeClass = Moralis.Object.extend("InviteCodeData");
      const emailQuery = new Moralis.Query(inviteCodeClass);
      const addressQuery = new Moralis.Query(inviteCodeClass);
      const inviteCodeData = new Moralis.Object("InviteCodeData");

      emailQuery.equalTo("email", email);
      addressQuery.equalTo("walletAddress", walletAddress.toLowerCase());
      const query = Moralis.Query.or(emailQuery, addressQuery);
      const result = await query.first({ useMasterKey: true });
      if (result) {
        throw new Error("already joined");
      }
      await inviteCodeData.save(
        {
          email,
          walletAddress: walletAddress.toLowerCase(),
          status: "pending",
          valid: false,
          renewed: false,
        },
        { useMasterKey: true }
      );
      // Moralis.Cloud.sendEmail({
      //   to: email,
      //   templateId: "d-4109aacc47ff4f35b75b1e822e88d5bb",
      // });
      return true;
    } catch (error) {
      logger.error(error.message);
      logger.error(JSON.stringify(error));
      throw new Error(error.message || "joinWaitlist failed");
    }
  },
  {
    fields: ["email", "walletAddress", "token"],
  }
);

// Cloud function to update history of an NFT
async function updateHistory(data) {
  try {
    const history = new Moralis.Object("History");
    const { user, amount, type, remark, NFTData } = data;

    await history.save(
      { user, amount, type, remark, NFTData },
      { useMasterKey: true }
    );
    return;
  } catch (error) {
    logger.error("update history failed");
    logger.error(error.message);
    logger.error(JSON.stringify(error));
    throw new Error("error updating history");
  }
}

// Cloud funtion for Adding User Activity to UserActivity Class
// description: "Your NFT was sold for 9ETH", notifyUser: true/false, type: success/error, category: NFT/Account/etc,
// if notifyUser is true, then send notification to user & show the notification on the notifications page, else show the activity on the acitivties page
// used data object for readablity. developers should manually take care of the data type
async function addUserActivity(data) {
  try {
    const {
      description,
      notifyUser,
      user,
      amount,
      type,
      remark,
      status,
      NFTData = null,
      miscUserinfo = null,
    } = data;
    const activityData = {
      description,
      notifyUser,
      user,
      NFTData,
      amount,
      type,
      remark,
      status,
      read: false,
      miscUserinfo,
    };
    const UserActivity = new Moralis.Object("UserActivity");
    await UserActivity.save(activityData, { useMasterKey: true });
    return true;
  } catch (error) {
    logger.error("adding user activity failed");
    logger.error(JSON.stringify(error));
    logger.error(error.message);
    throw new Error("error updating user Activity");
  }
}

async function incrementViewCount(sessionToken, id) {
  try {
    const NFTData = Moralis.Object.extend("NFTData");
    const viewData = new Moralis.Query("NFTViewData");
    const nftQuery = new Moralis.Query(NFTData);
    nftQuery.equalTo("objectId", id);
    const nftData = await nftQuery.first({ useMasterKey: true });
    viewData.equalTo("nftData", nftData);
    const viewObject = await viewData.first({ useMasterKey: true });
    if (viewObject) {
      const sessionArray = viewObject.get("sessions");
      const included = sessionArray.includes(sessionToken);
      if (!included) {
        sessionArray.push(sessionToken);
        viewObject.set("sessions", sessionArray);
        viewObject.save(null, { useMasterKey: true });
        nftData.set("views", nftData.get("views") + 1);
        nftData.save(null, { useMasterKey: true });
        return;
      }
    } else {
      const view = new Moralis.Object("NFTViewData");
      view.save(
        {
          nftData,
          sessions: [sessionToken],
        },
        { useMasterKey: true }
      );
      nftData.set("views", 1);
      nftData.save(null, { useMasterKey: true });
    }
    return;
  } catch (error) {
    logger.error("incrimentViewCount failed");
    logger.error(error.message);
    logger.error(JSON.stringify(error));
    throw new error("incrimentViewCount failed");
  }
}
