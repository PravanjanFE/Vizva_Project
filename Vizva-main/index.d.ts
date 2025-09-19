declare module "vizva" {
  export interface NFT {
    attributes: any[];
    title: string;
    owner?: {
      amount: string;
      time: string;
      user: Pick<User, "profilePic", "name", "username">;
    };
    createdBy: {
      username: string;
      name?: string;
      profilePic?: {
        url: string;
      };
    };
    highestBidInETH: string;
    endTime: { iso: string };
    saleCreated: string;
    amount: string;
    bids: any[]; //type
    description: string;
    history: any[]; // type
    amountInETH: string;
    id: string;
    likes: number;
    userLiked: boolean;
    size: {
      width: string | number;
      height: string | number;
    };
    tags: string[];
    mediaFormat: "video" | "image" | "audio";
    minted: boolean;
    voucher: string;
    imageGateway: string;
    file: string;
    marketId: string;
    onSale: boolean;
    saleId: string;
    tokenId: string;
    tokenAddress: string;
    currency: string;
    nft_owner: string;
    royalties: number;
    type: string;
    format: string;
    views: number;
  }

  export declare const NFT_DEFAULT_PROPS = {
    attributes: [],
    title: "",
    owner: {
      amount: "",
      time: "",
      user: {
        username: "",
        name: "",
        profilePic: {
          url: "",
        },
      },
    },
    createdBy: {
      username: "",
      name: "",
      profilePic: {
        url: "",
      },
    },
    highestBidInETH: "",
    endTime: { iso: "" },
    amount: "",
    bids: [], //type
    description: "",
    history: [], // type
    amountInETH: "",
    id: "",
    likes: 0,
    userLiked: false,
    size: {
      width: 0,
      height: 0,
    },
    tags: [],
    mediaFormat: "image",
    minted: false,
    voucher: "",
    imageGateway: "",
    marketId: "",
    onSale: false,
    saleId: "",
    tokenId: "",
    tokenAddress: "",
    currency: "",
    nft_owner: "",
    royalties: 0,
    type: "",
    format: "",
    views: 0,
  };

  export type USER_SOCIAL_FOLLOWER = {
    createdAt: Date | string;
    updatedAt: Date | string;
    objectId: string;
    follower: Pick<User, "objectId" | "name" | "username" | "profilePic">;
  };

  export type USER_SOCIAL_FOLLOWING = {
    createdAt: Date | string;
    updatedAt: Date | string;
    objectId: string;
    following: Pick<User, "objectId" | "name" | "username" | "profilePic">;
  };

  export interface User {
    bio?: string;
    coverPic?: { url: string };
    createdAt: string | number | Date;
    ethAddress: string;
    followers: number; //0
    following: number; //0
    followingUsers: USER_SOCIAL_FOLLOWING[];
    followersUsers: USER_SOCIAL_FOLLOWER[];
    instagram?: string;
    isFollowing: boolean;
    isLiked: boolean;
    name: string;
    nftCreated: number; //0
    nftOwned: number; //0
    nftSold: number; //0
    nftWishlisted: number;
    objectId: string;
    profilePic?: {
      url: string;
    };
    twitter?: string;
    username: string;
    verified: boolean;
  }

  export interface NFTCardProps {
    data: NFT; // type this
    onClick?: () => void;
    className?: string;
    href?: string;
  }

  export interface UserCardProps {
    isHome?: boolean;
    isCollaborations?: boolean;
    data: User;
  }

  export interface NFTDetailsLayoutProps {
    nft: NFT;
    myNFT: boolean;
    isAuthenticated: boolean;
    isLiked: boolean;
    isWishlisted: boolean;
    bottomButtons: JSX.Element;
  }
}
