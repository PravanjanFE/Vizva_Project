export interface HistoryProps {
  data: NOTIFICATION_TYPE[];
  className?: string;
  close?: () => void;
}
export interface HistoryItemProps {
  data: NOTIFICATION_TYPE;
}

type BidTypes = "NEW_BID" | "ACCEPTED_BID" | "PLACED_BID";
type AccountTypes = "LIKE" | "SHARE" | "FOLLOWER";

interface BASE {
  read: boolean;
  type: "success" | "error";
  notifyUser: boolean;
  createdAt: string;
  updatedAt: string;
  objectId: string;
}

interface BID extends BASE {
  user?: object;
  nftName: string;
  price: number | string;
  currency?: "MATIC"  | "WMATIC"
  category: BidTypes;
}

interface ACCOUNT extends BASE {
  user: object;
  category: AccountTypes;
}

interface CREDIT_ADDED extends BASE {
  price: number | string;
  currency?: "MATIC" | "WMATIC";
  category: "CREDIT_ADDED";
}

interface SOLD_NFT extends BASE {
  nftName: string;
  user: object;
  price: number | string;
  currency?: "MATIC" | "WMATIC";
  category: "SOLD_NFT";
}

export type NOTIFICATION_TYPE = BID | ACCOUNT | CREDIT_ADDED | SOLD_NFT;