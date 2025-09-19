import { User } from "vizva";

interface CategoryProps {
  updateCategory: (category: CATEGORIES_TYPE) => void;
  createdNFTs: number;
  collectedNFTs: number;
  wishlistNFTs: number;
  active: CATEGORIES_TYPE;
  isMyProfile: boolean;
}

// export interface User {
//   objectId: string;
//   username: string;
//   name: string;
//   nftSold: number;
//   coverPic?: { __type: string; name: string; url: string };
//   profilePic?: {
//     __type: string;
//     name: string;
//     url: string;
//   };
//   ethAddress: string;
//   createdAt: string;
//   verified: boolean;
//   isFollowing?: boolean;
//   isLiked?: boolean;
//   nftCreated: number;
//   nftOwned?: number;
//   following: number;
//   followers: number;
//   followingUsers?: Array<followingUser>;
//   followersUsers?: Array<followerUser>;
//   twitter: string;
//   instagram: string;
//   bio: string;
// }
type CATEGORIES_TYPE = "created" | "collected" | "wishlist";
const CATEGORIES: CATEGORIES_TYPE[] = ["created", "collected", "wishlist"];
type FILTERS_TYPE = "All" | "Auctions" | "Instant Buy" | "On Sale";
const FILTERS: FILTERS_TYPE[] = ["All", "Auctions", "Instant Buy", "On Sale"];

interface FOLLOWING_USER {
  following: Pick<User, "objectId" | "name" | "username" | "profilePic">;
}

interface FOLLOWER_USER {
  follower: Pick<User, "objectId" | "name" | "username" | "profilePic">;
}

interface PROFILE_DETAILS_PROPS {
  isMyProfile: boolean;
  isFollowing: boolean;
  loading: boolean;
  followUnfollowUser: (id: string) => void;
  openSocialModal: () => void;
  updateActiveSocial: (social: "following" | "followers") => void;
  profile: User;
}

interface SOCIAL_MEDIA_PROPS {
  isOpen: boolean;
  active: "following" | "followers";
  profile: User;
  isMyProfile: boolean;
  close: () => void;
  updateActiveSocial: (value: "following" | "followers") => void;
  followUser: (id: string, username: string) => void;
  unFollowUser: (id: string, username: string) => void;
  loading: boolean;
}

interface TYPE_FILTER_PROPS {
  active: FILTERS_TYPE;
  updateFilter: (value: FILTERS_TYPE) => void;
}

interface INFO_BAR_PROPS {
  address: string;
  myProfile: boolean;
  className?: string;
  profile: User;
}

interface COVER_PIC_HEADER_PROPS {
  isMyProfile: boolean;
  coverPic?: string;
  profilePic?: string;
  ethAddress: string;
  isFollowing: boolean;
  id: string;
  followUnfollowUser: (id: string) => void;
  loading: boolean;
  profile:User;
}

export { CATEGORIES, FILTERS };

export type {
  CategoryProps,
  CATEGORIES_TYPE,
  FILTERS_TYPE,
  FOLLOWER_USER,
  FOLLOWING_USER,
  PROFILE_DETAILS_PROPS,
  SOCIAL_MEDIA_PROPS,
  TYPE_FILTER_PROPS,
  INFO_BAR_PROPS,
  COVER_PIC_HEADER_PROPS,
};
