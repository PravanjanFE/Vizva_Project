const history = [
  {
    name: "alex henry",
    amountBid: "1.00",
    currency: "ethereum",
    time: Date.now(),
    type: "bid",
  },
  {
      name: "ultimus maximus",
      amountBid: "1.00",
      currency: "ethereum",
      time: Date.now() - 60 * 60 * 60 * 60,
      type: "bid",
    },
    {
      name: "alex henry",
      amountBid: "1.00",
      currency: "ethereum",
      time: Date.now() - 60 * 60 * 8,
      type: "bid",
    },
  {
    name: "artist name",
    amount: "1.00",
    currency: "ethereum",
    time: Date.now() - 60 * 60 * 8,
    type: "listed",
  },
  {
    name: "artist name",
    amount: "",
    time: Date.now() - 60 * 60 * 1,
    type: "minted",
  },
  {
    name: "artist name",
    amount: "1.00",
    currency: "ethereum",
    time: Date.now() - 60 * 60 * 60 * 60 * 5,
    type: "listed",
  },
  {
    name: "artist name",
    amount: "1.00",
    currency: "ethereum",
    time: Date.now() - 60 * 60 * 3,
    type: "listed",
  },
  {
    name: "artist name",
    amount: "1.00",
    currency: "ethereum",
    time: Date.now() - 60 * 60 * 80,
    type: "listed",
  },
  {
    name: "artist name",
    amount: "",
    time: Date.now() - 60 * 60 * 800,
    type: "minted",
  },
];

export default history;