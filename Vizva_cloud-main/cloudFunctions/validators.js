// contains  validation Methods

// Cloud function to check if an NFT is in User's wishlist
Moralis.Cloud.define(
  "isWishlistedByUser",
  async (request) => {
    try {
      const user = request.user;
      const nftId = request.params.nftId; // object ID of NFT
      if (!user || !nftId) return; // bail early if user is not logged in or artwork is not provided
      // get NFT object from NFT Data by objectid
      const nftQuery = new Moralis.Query("NFTData");
      nftQuery.equalTo("objectId", nftId);
      const nftQueryResult = await nftQuery.first({ useMasterKey: true });
      const wishlistQuery = new Moralis.Query("UserWishlist");
      wishlistQuery.equalTo("User", user);
      wishlistQuery.equalTo("NFT", nftQueryResult);
      const wishlistQueryResult = await wishlistQuery.first({
        useMasterKey: true,
      });
      if (wishlistQueryResult) {
        return true; // item in wishlist
      } else {
        return false;
      }
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    fields: ["nftId"],
    requireUser: true,
  }
);

// Cloud function to check if the provided username is taken or not
Moralis.Cloud.define(
  "isUsernameTaken",
  async (request) => {
    try {
      const username = request.params.username;
      const userQuery = new Moralis.Query(Moralis.User);
      userQuery.equalTo("username", username);
      userQuery.notEqualTo("objectId", request.user);
      const userObject = await userQuery.first({ useMasterKey: true });
      if (request.user?.id == userObject?.id) {
        return false;
      }
      if (userObject) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      logger.error(error.message);
      return "failed to process username";
    }
  },
  {
    fields: ["username"],
  }
);

// Cloud function to check if user has liked a NFT or user
// Params: User, likeClass & likeObjectId of the liked NFT or user
Moralis.Cloud.define(
  "isLikedByUser",
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
        return true;
      } else {
        return false;
      }
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    fields: ["likeClass", "likeObjectId"],
    requireUser: true,
  }
);

// Function to check if the user requesting is following the user. Follower is the one requesting, Following is the one being followed
Moralis.Cloud.define(
  "isFollowingUser",
  async (request) => {
    try {
      const followingId = request.params.followingId;
      // Bail early if followingId is empty or request.user is empty
      if (!followingId || !request.user) return "params missing";
      if (followingId == request.user.id) return false;

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
        // user is following this user. stalker alert.
        return true;
      } else {
        return false;
      }
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    fields: ["followingId"],
    requireUser: true,
  }
);
