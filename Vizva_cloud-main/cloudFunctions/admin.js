// Helper Function for cloud functions to check if user is staff (an admin or subadmin)
async function isUserStaff(user) {
  try {
    if (!user) return false; // if no user bail early
    const adminUser = user;
    const adminRoleQuery = new Moralis.Query(Moralis.Role);
    adminRoleQuery.equalTo("name", "admin");
    adminRoleQuery.equalTo("users", adminUser);
    const subadminRoleQuery = new Moralis.Query(Moralis.Role);
    subadminRoleQuery.equalTo("name", "subadmin");
    subadminRoleQuery.equalTo("users", adminUser);
    const adminRoleObjectQuery = Moralis.Query.or(
      adminRoleQuery,
      subadminRoleQuery
    );
    const adminRoleObject = await adminRoleObjectQuery.first({
      useMasterKey: true,
    });
    if (adminRoleObject) {
      // request user is admin/subadmin
      return true;
    } else {
      // request user is not admin or subadmin
      return false;
    }
  } catch (error) {
    logger.error(JSON.stringify(error));
    return false;
  }
}

// Cloud function to check if backend is allowed for user
Moralis.Cloud.define(
  "isBackendAccessAllowed",
  async (request) => {
    try {
      const user = request.user;
      const isStaff = await isUserStaff(user);
      if (isStaff) {
        // user is admin/subadmin
        return true;
      } else {
        // user is not admin/subadmin
        return false;
      }
    } catch (error) {
      logger.error(JSON.stringify(error));
      return false;
    }
  },
  {
    requireUser: true,
  }
);

// Cloud function to check if the user is an admin via username
Moralis.Cloud.define(
  "isUserAdmin",
  async (request) => {
    try {
      const username = request.params.username;
      // get user object from username
      const userQuery = new Moralis.Query(Moralis.User);
      userQuery.equalTo("username", username);
      const userObject = await userQuery.first({ useMasterKey: true });
      if (userObject) {
        // get admin role object from admin role name
        const roleQuery = new Moralis.Query(Moralis.Role);
        roleQuery.equalTo("name", "admin");
        roleQuery.equalTo("users", userObject);
        const roleObject = await roleQuery.first({ useMasterKey: true });
        if (roleObject) {
          return true;
        }
      }
      return false;
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    fields: ["username"],
    requireUser: false,
  }
);

// Cloud function to check if the user is a subadmin via username
Moralis.Cloud.define(
  "isUserSubAdmin",
  async (request) => {
    try {
      const username = request.params.username;
      // get user object from username
      const userQuery = new Moralis.Query(Moralis.User);
      userQuery.equalTo("username", username);
      const userObject = await userQuery.first({ useMasterKey: true });
      if (userObject) {
        // check for subadmin role∂
        const subadminRoleQuery = new Moralis.Query(Moralis.Role);
        subadminRoleQuery.equalTo("name", "subadmin");
        subadminRoleQuery.equalTo("users", userObject);
        const subadminRoleObject = await subadminRoleQuery.first({
          useMasterKey: true,
        });
        if (subadminRoleObject) {
          return true;
        }
      }
      return false;
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    fields: ["username"],
    requireUser: false,
  }
);

// Cloud function to check the pages allowed for the admin
Moralis.Cloud.define(
  "getAdminPagesAllowed",
  async (request) => {
    try {
      const adminUser = request.user;
      // check if request user is admin or subadmin
      const isStaff = await isUserStaff(adminUser);
      if (isStaff) {
        // request user is admin
        // query user and return backendPermissions
        const adminUserQuery = new Moralis.Query(Moralis.User);
        adminUserQuery.equalTo("objectId", adminUser.id);
        const adminUserObject = await adminUserQuery.first({
          useMasterKey: true,
        });
        if (adminUserObject) {
          const result = adminUserObject.get("backendPermissions");
          return JSON.stringify(result);
        }
      }
      return [];
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    fields: [],
    requireUser: true,
  }
);

// Cloud function create a new admin user
Moralis.Cloud.define(
  "createNewAdminUser",
  async (request) => {
    try {
      const adminUser = request.user;
      // check if adminUser has an admin role
      const adminRoleQuery = new Moralis.Query(Moralis.Role);
      adminRoleQuery.equalTo("name", "admin");
      adminRoleQuery.equalTo("users", adminUser);
      const adminRoleObject = await adminRoleQuery.first({
        useMasterKey: true,
      });
      if (adminRoleObject) {
        // request user is an admin and can create a new admin user
        const email = request.params.email;
        const role = request.params.role;
        const pages = request.params.pages;
        const user = new Moralis.User();
        const backendPermissions = [{ role: role, pages: pages }];
        // generate a random password
        const password = Math.random().toString(36).slice(-8);
        user.set("username", email);
        user.set("password", password);
        user.set("email", email);
        user.set("backendPermissions", backendPermissions);
        await user.signUp();
        // add user to admin/subadmin role
        const roleQuery = new Moralis.Query(Moralis.Role);
        roleQuery.equalTo("name", role);
        const roleObject = await roleQuery.first({ useMasterKey: true });
        if (roleObject) {
          // get user from email
          const userQuery = new Moralis.Query(Moralis.User);
          userQuery.equalTo("email", email);
          const userObject = await userQuery.first({ useMasterKey: true });
          if (userObject) {
            roleObject.getUsers({ useMasterKey: true }).add(userObject);
            await roleObject.save({}, { useMasterKey: true });
          }
        }
        // Optional TODO: send email to user with reset password page
        return {
          success: true,
          msg: "Created a new user with pass: " + password,
        };
      } else {
        // request user is not an admin and is getting way out of his league
        return {
          success: false,
          msg: "Hold on! You are not authorized to do that son.",
        };
      }
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    fields: ["email", "role", "pages"],
    requireUser: true,
  }
);

// Cloud function to edit and update a subadmin user, edit role and pages
Moralis.Cloud.define(
  "editSubAdminUser",
  async (request) => {
    try {
      const adminUser = request.user;
      // check if adminUser has an admin role
      const adminRoleQuery = new Moralis.Query(Moralis.Role);
      adminRoleQuery.equalTo("name", "admin");
      adminRoleQuery.equalTo("users", adminUser);
      const adminRoleObject = await adminRoleQuery.first({
        useMasterKey: true,
      });
      if (adminRoleObject) {
        // request user is an admin and can edit a subadmin user
        const email = request.params.email;
        const role = request.params.role;
        const pages = request.params.pages;
        // get user from email
        const userQuery = new Moralis.Query(Moralis.User);
        userQuery.equalTo("email", email);
        const userObject = await userQuery.first({ useMasterKey: true });
        if (userObject) {
          // update backendPermissions
          const backendPermissions = [{ role: role, pages: pages }];
          userObject.set("backendPermissions", backendPermissions);
          await userObject.save({}, { useMasterKey: true });
          // add user to admin/subadmin role
          const roleQuery = new Moralis.Query(Moralis.Role);
          roleQuery.equalTo("name", role);
          const roleObject = await roleQuery.first({ useMasterKey: true });
          if (roleObject) {
            // get user from email
            const userQuery = new Moralis.Query(Moralis.User);
            userQuery.equalTo("email", email);
            const userObject = await userQuery.first({ useMasterKey: true });
            if (userObject) {
              roleObject.getUsers({ useMasterKey: true }).add(userObject);
              await roleObject.save({}, { useMasterKey: true });
            }
          }
          return {
            success: true,
            msg: "Updated details for user: " + email,
          };
        }
      }
      return {
        success: false,
        msg: "Hold on! You are not authorized to do that son.",
      };
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    fields: ["email", "role", "pages"],
    requireUser: true,
  }
);

// Cloud function to get all the users via admin
Moralis.Cloud.define(
  "getAllUsersViaAdmin",
  async (request) => {
    try {
      const adminUser = request.user;
      // check if request user is admin or subadmin
      const isStaff = await isUserStaff(adminUser);
      if (isStaff) {
        // request user is admin
        const NFTData = Moralis.Object.extend("NFTData");
        const query = new Moralis.Query("User");
        const skipId = request.params.skipId || 0;
        const skipCount = request.params.skip || 0;
        query.notEqualTo("objectId", skipId);
        query.select(
          "createdAt",
          "objectId",
          "bio",
          "name",
          "profilePic",
          "coverPic",
          "username",
          "email",
          "ethAddress",
          "verified",
          "backendPermissions"
        );
        // query.limit(8);
        query.skip(skipCount);
        const queryResults = await query.find({ useMasterKey: true });
        const result = [];
        for (let i = 0; i < queryResults.length; i++) {
          const user = queryResults[i];
          let userObject = JSON.parse(JSON.stringify(user));
          // get NFT's created by the user
          const NFTQuery = new Moralis.Query(NFTData);
          NFTQuery.equalTo("createdBy", user);
          NFTQuery.exists("tokenId");
          const nftCount = (await NFTQuery.find()).length;
          userObject.nftCreated = nftCount;
          // if user's username is not coreservices
          if (userObject.username !== "coreservices") {
            result.push(userObject);
          }
        }
        return result;
      } else {
        // request user is not an admin
        return [];
      }
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    requireUser: true,
  }
);

// Cloud function to delete a user from admin panel
Moralis.Cloud.define(
  "deleteUserViaAdmin",
  async (request) => {
    try {
      const adminUser = request.user;
      // check if adminUser has an admin role (as only admins can delete other uses)
      const adminRoleQuery = new Moralis.Query(Moralis.Role);
      adminRoleQuery.equalTo("name", "admin");
      adminRoleQuery.equalTo("users", adminUser);
      const adminRoleObject = await adminRoleQuery.first({
        useMasterKey: true,
      });
      if (adminRoleObject) {
        // request user is an admin and can delete a user
        const userId = request.params.userId;
        // get user from userId/objectId
        const userQuery = new Moralis.Query(Moralis.User);
        userQuery.equalTo("objectId", userId);
        const userObject = await userQuery.first({ useMasterKey: true });
        if (userObject) {
          // check if the user is not an admin
          const adminRoleQuery = new Moralis.Query(Moralis.Role);
          adminRoleQuery.equalTo("name", "admin");
          adminRoleQuery.equalTo("users", userObject);
          const adminRoleObject = await adminRoleQuery.first({
            useMasterKey: true,
          });
          if (!adminRoleObject) {
            // delete user
            await userObject.destroy({ useMasterKey: true });
            return {
              success: true,
              msg: "User deleted",
            };
          } else {
            // no one can delete another admin, not even admins
            return {
              success: false,
              msg: "You can't delete an admin",
            };
          }
        } else {
          return {
            success: false,
            msg: "User does not exist",
          };
        }
      }
      return {
        success: false,
        msg: "You are not authorized to do that son",
      };
    } catch (error) {
      logger.error(error.message);
    }
  },
  {
    fields: ["userId"],
    requireUser: true,
  }
);

Moralis.Cloud.define("approveJoin", async (request) => {
  try {
    // add a logic to accessControll
    const { id } = request.params;
    const adminUser = request.user;
    // check if request user is admin or subadmin
    const isStaff = await isUserStaff(adminUser);
    if (!isStaff) {
      // if not admin, stop execution and throw error.
      throw new Error("Hold on! You are not authorized to do that son.");
    }
    // otherwise go this way
    const inviteCodeClass = Moralis.Object.extend("InviteCodeData");
    const query = new Moralis.Query(inviteCodeClass);
    query.equalTo("objectId", id);
    query.first({ useMasterKey: true }).then((data) => {
      const randomCode = crypto.randomUUID();
      const inviteCode = randomCode.slice(0, 8);
      data.set("valid", true);
      data.set("status", "approved");
      data.set("approvedOn", new Date());
      data.set("inviteCode", inviteCode);
      Moralis.Cloud.sendEmail({
        to: data.get("email"),
        templateId: "d-6ec9bfa93d8e4d5fa828fa6598438f63",
        dynamic_template_data: {
          code: inviteCode,
        },
      });
      data.save(null, { useMasterKey: true });
    });
  } catch (error) {
    logger.error(error.message);
    logger.error(JSON.stringify(error));
    throw new Error(error.message || "approveJoin failed");
  }
},
  {
    requireUser: true,
  }
);

Moralis.Cloud.define("resendInvite", async (request) => {
  try {
    // add a logic to accessControll
    const { id, walletAddress } = request.params;
    const adminUser = request.user;
    // check if request user is admin or subadmin
    const isStaff = await isUserStaff(adminUser);
    if (!isStaff) {
      // if not admin, stop execution and throw error.
      throw new Error("Hold on! You are not authorized to do that son.");
    }
    // otherwise go this way
    const inviteCodeData = new Moralis.Object("InviteCodeData");
    const inviteCodeClass = Moralis.Object.extend("InviteCodeData");
    const query = new Moralis.Query(inviteCodeClass);
    query.equalTo("objectId", id);
    const data = await query.first({ useMasterKey: true });
    const randomCode = crypto.randomUUID();
    const inviteCode = randomCode.slice(0, 8);
    data.set("valid", false);
    data.set("renewed", true);
    await inviteCodeData.save(
      {
        email: data.get("email"),
        walletAddress: walletAddress.toLowerCase(),
        status: "approved",
        valid: true,
        renewed: false,
        approvedOn: new Date(),
        inviteCode,
      },
      { useMasterKey: true }
    );
    Moralis.Cloud.sendEmail({
      to: data.get("email"),
      templateId: "d-6ec9bfa93d8e4d5fa828fa6598438f63",
      dynamic_template_data: {
        code: inviteCode,
      },
    });
    data.save(null, { useMasterKey: true });
  } catch (error) {
    logger.error(error.message);
    logger.error(JSON.stringify(error));
    throw new Error(error.message || "resend invite failed");
  }
},
  {
    requireUser: true,
  }
);

Moralis.Cloud.define("moveToWaitlist", async (request) => {
  try {
    // add a logic to accessControll
    const { id } = request.params;
    const adminUser = request.user;
    // check if request user is admin or subadmin
    const isStaff = await isUserStaff(adminUser);
    if (!isStaff) {
      // if not admin, stop execution and throw error.
      throw new Error("Hold on! You are not authorized to do that son.");
    }
    // otherwise go this way
    const inviteCodeClass = Moralis.Object.extend("InviteCodeData");
    const query = new Moralis.Query(inviteCodeClass);
    query.equalTo("objectId", id);
    query.first({ useMasterKey: true }).then((data) => {
      data.set("status", "waitlist");
      data.save(null, { useMasterKey: true });
    });
  } catch (error) {
    logger.error(error.message);
    logger.error(JSON.stringify(error));
    throw new Error(error.message || "moveToWaitlist failed");
  }
},
  {
    requireUser: true,
  }
);

// Cloud function to get all VerificationData from class VerificationData, limit 100 with Desc
Moralis.Cloud.define("getVerificationData", async (request) => {
  try {
    const adminUser = request.user;
    const isStaff = await isUserStaff(adminUser);
    if (!isStaff) {
      // if request user is not staff, bail early 
      throw new Error("Hold on! You are not authorized to do that son.");
    }
    const skip = request.params.skip || 0;
    const verificationDataClass = Moralis.Object.extend("VerificationData");
    const query = new Moralis.Query(verificationDataClass);
    query.descending("createdAt");
    query.skip(skip);
    query.limit(20);
    const data = await query.find({ useMasterKey: true });
    var verification_data = [];
    // for each data in data, get the user's username, createdAt, ethAddress and add it to the response
    for (let i = 0; i < data.length; i++) {
      const userId = data[i].attributes.user.id;
      const userQuery = new Moralis.Query(Moralis.User);
      userQuery.equalTo("objectId", userId);
      const userData = await userQuery.first({ useMasterKey: true });
      var verifiedBy = '';
      if (data[i].get("verifiedBy")) {
        const verifiedById = data[i].get("verifiedBy").id;
        const verifiedByQuery = new Moralis.Query(Moralis.User);
        verifiedByQuery.equalTo("objectId", verifiedById);
        const verifiedByData = await verifiedByQuery.first({
          useMasterKey: true,
        });
        verifiedBy = verifiedByData.get('username');
      }
      verification_data.push({
        verificationId: data[i].id,
        artistName: userData.get("username"),
        ethAddress: userData.get("ethAddress"),
        profilePic: userData.get("profilePic")?._url,
        onboardingDate: userData.get("createdAt").toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }).split(',')[0],
        requestDate: data[i].get("createdAt").toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }).split(',')[0],
        status: data[i].get("status"),
        notified: data[i].get("notified") || false,
        verifiedBy: verifiedBy || "",
      });
    };
    return verification_data;
  } catch (error) {
    logger.error(error.message);
    logger.error(JSON.stringify(error));
    throw new Error(error.message || "getVerificationData failed");
  }
}, {
  requireUser: true,
});

// Cloud function to get all VerificationData by ID from class VerificationData
Moralis.Cloud.define("getVerificationDataById", async (request) => {
  try {
    const adminUser = request.user;
    const isStaff = await isUserStaff(adminUser);
    if (!isStaff) {
      // if request user is not staff, bail early 
      throw new Error("Hold on! You are not authorized to do that son.");
    }
    const verificationId = request.params.verificationId;
    const verificationDataClass = Moralis.Object.extend("VerificationData");
    const query = new Moralis.Query(verificationDataClass);
    query.equalTo("objectId", verificationId);
    const data = await query.first({ useMasterKey: true });
    var verification_data = [];
    // get the user's username, createdAt, ethAddress and add it to the response
    const userId = data.attributes.user.id;
    const userQuery = new Moralis.Query(Moralis.User);
    userQuery.equalTo("objectId", userId);
    const userData = await userQuery.first({ useMasterKey: true });
    // get followers count
    const followerQuery = new Moralis.Query('UserFollow');
    followerQuery.equalTo('following', userData);
    const followerCount = await followerQuery.count({ useMasterKey: true });
    var followersCount = 0;
    if (followerCount.length > 0) {
      followersCount = followerCount.length;
    }
    verification_data.push({
      verificationId: data.id,
      artistName: userData.get("username"),
      ethAddress: userData.get("ethAddress"),
      profilePic: userData.get("profilePic")?._url,
      onboardingDate: userData.get("createdAt").toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }).split(',')[0],
      requestDate: data.get("createdAt").toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }).split(',')[0],
      status: data.get("status"),
      notified: data.get("notified") || false,
      nftCreated: userData.get("nftCreated") || 0,
      nftSold: userData.get("nftSold") || 0,
      followers: followersCount,
      bio: data.get("bio"),
      portfolio: data.get("portfolio"),
      previousWork: data.get("previousWork")?._url,
      instagram: data.get("instagram"),
      twitter: data.get("twitter"),
      rarible: data.get("rarible"),
      type: data.get("type"),
      email: data.get("email"),
    });
    return verification_data;
  } catch (error) {
    logger.error(error.message);
    logger.error(JSON.stringify(error));
    throw new Error(error.message || "getVerificationDataById failed");
  }
}, {
  requireUser: true,
});

// changeVerificationStatus
Moralis.Cloud.define("changeVerificationStatus", async (request) => {
  try {
    const adminUser = request.user;
    const isStaff = await isUserStaff(adminUser);
    if (!isStaff) {
      // if request user is not staff, bail early 
      throw new Error("Hold on! You are not authorized to do that son.");
    }
    const verificationId = request.params.verificationId;
    var status = request.params.status;
    // switch status (checking for valid status)
    switch (status) {
      case "approved":
        status = "approved";
        break;
      case "rejected":
        status = "rejected";
        break;
      case "pending":
        status = "pending";
        break;
      default:
        status = "pending";
        break;
    }
    const verificationDataClass = Moralis.Object.extend("VerificationData");
    const query = new Moralis.Query(verificationDataClass);
    query.equalTo("objectId", verificationId);
    const data = await query.first({ useMasterKey: true });
    data.set("status", status);
    data.set("verifiedBy", adminUser);
    data.save(null, { useMasterKey: true });
    return {
      success: true,
      message: "Verification status changed to " + status,
    }
  } catch (error) {
    logger.error(error.message);
    logger.error(JSON.stringify(error));
    throw new Error(error.message || "changeVerificationStatus failed");
  }
}
  , {
    requireUser: true,
  }
);

// notifyUserVerification
Moralis.Cloud.define("notifyUserVerification", async (request) => {
  try {
    const adminUser = request.user;
    const isStaff = await isUserStaff(adminUser);
    if (!isStaff) {
      // if request user is not staff, bail early 
      throw new Error("Hold on! You are not authorized to do that son.");
    }
    const verificationId = request.params.verificationId;
    const verificationDataClass = Moralis.Object.extend("VerificationData");
    const query = new Moralis.Query(verificationDataClass);
    query.equalTo("objectId", verificationId);
    const data = await query.first({ useMasterKey: true });
    // if data.notified is true, bail early
    if (data.get("notified") === true) {
      return {
        success: false,
        message: "User already notified",
      }
    }
    const email = data.get("email");
    if (!email) {
      return {
        success: false,
        message: "No email found for this user. Could not send notification.",
      }
    }
    data.set("notified", true);
    data.save(null, { useMasterKey: true });
    Moralis.Cloud.sendEmail({
      to: data.get("email"),
      templateId: "d-b7e8c9be345646fa9e876008ad2c5428"
    });
    return {
      success: true,
      message: "Verification Email sent to the user.",
    }
  } catch (error) {
    logger.error(error.message);
    logger.error(JSON.stringify(error));
    throw new Error(error.message || "notifyUserVerification failed");
  }
}, {
  requireUser: true,
}
);
