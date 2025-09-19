const messages: any = {
  "Non ethereum enabled browser": "Please Install Metamask Browser Extension",
  "MetaMask Message Signature: User denied message signature.": "Authentication Request Denied",
  "User closed modal": "WC-QR Code closed",
  "no_invite_code": "Please get an invite code",
  "invite_code_mismatch": "The invite code you have entered doesn't match with our record",
  "Already processing eth_requestAccounts. Please wait.": "Please unlock your wallet",
  "joinWaitlist failed": "We have trouble adding waitlist. Try it after sometime",
  "already joined": "Your email or wallet address is already on waiting list. Keep a track on your email for the invitecode",
  "insufficient funds": "You doesn't have enough balance for this action.",
  "invalid wallet address": "The wallet address you have entered is not valid. Please check.",
  "invalid email address": "The email address you have entered is not valid. Please check.",
  "accepting bid failed: auction already ended": "Oops!.. Auction Expired :(",
  "MetaMask Tx Signature: User denied transaction signature.": "Oops!.. transaction rejected.",
  "execution reverted: Vizva: new price not in acceptable range": "Please provide a valid amount"
}

let handler = {
  get: function (target: any, name: string) {
    return target.hasOwnProperty(name) ? target[name] : "something went wrong";
  }
};
export const errorMsg = new Proxy(messages, handler);
