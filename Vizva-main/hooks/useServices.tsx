import {
  IERC20Options,
  IERC721Options,
  vizvaMarketOption,
  vizva721Option,
  wethOption,
} from "config";
import { useContext, useEffect, useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { errorMsg } from "public/error";
import { PriceContext } from "context/priceContext";

export function usefetchPairPrice() {
  const { data, loading } = useContext(PriceContext);

  return {
    data,
    loading,
  };
}

export function useCancelSale() {
  const [loading, setLoading] = useState<any>(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const { Moralis } = useMoralis();

  async function execute(marketId: string) {
    try {
      setLoading(true);
      const transaction = await Moralis.executeFunction({
        functionName: "cancelSale",
        params: {
          _id: marketId,
        },
        ...vizvaMarketOption,
      });
      //@ts-ignore
      const result = await transaction.wait();
      setData(result);
      setError(null);
      setLoading(false);
      return result;
    } catch (error: any) {
      setData(null);
      setLoading(false);
      var errMsg =
        error.message != "Internal JSON-RPC error."
          ? error.message
          : error.data.message;
      var message = errorMsg[errMsg];
      setError(message);
      console.error("cancel sale failed", error);
      throw new Error(message);
    }
  }

  return {
    data,
    loading,
    error,
    execute,
  };
}

export function useGetWETHBalance() {
  const [loading, setLoading] = useState<any>(true);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(0);
  const { Moralis } = useMoralis();

  async function execute() {
    try {
      if (Moralis.account) {
        const balance = await Moralis.executeFunction({
          functionName: "balanceOf",
          params: {
            account: Moralis.account,
          },
          contractAddress: wethOption.contractAddress,
          ...IERC20Options,
        });
        let res = balance
          ? Moralis.Units.FromWei(balance as unknown as string)
          : 0;
        setData(res);
      }
      setError(null);
      setLoading(false);
    } catch (error: any) {
      console.error("getting WMATIC balance failed", error);
      setData(0);
      setError("getting WMATIC balance failed");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (data) return;
    execute();
  });

  return {
    data,
    loading,
    error,
    execute,
  };
}

export function useGetMaticBalance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(0);
  const { Moralis, web3 } = useMoralis();

  async function execute() {
    try {
      if (Moralis.account) {
        const balance = await web3?.getBalance(Moralis?.account);
        let res = balance
          ? Moralis.Units.FromWei(balance?.toString() as string)
          : 0;
        setData(res);
      }
      setError(null);
      setLoading(false);
    } catch (error: any) {
      console.error("getting MATIC balance failed", error);
      setData(0);
      setError("getting MATIC balance failed");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (data) return;
    execute();
  });

  return {
    data,
    loading,
    error,
    execute,
  };
}

export function useWithdrawWETH() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const { Moralis } = useMoralis();

  async function execute(amount: string) {
    try {
      setLoading(true);
      const transaction = await Moralis.executeFunction({
        functionName: "withdraw",
        params: {
          wad: amount,
        },
        ...wethOption,
      });
      //@ts-ignore
      const result = await transaction.wait();
      setData(result);
      setLoading(false);
      setError(null);
      return result;
    } catch (error: any) {
      setData(null);
      setLoading(false);
      setError("Withdraw WMATIC failed");
      console.error(error);
      throw new Error();
    }
  }

  return {
    data,
    loading,
    error,
    execute,
  };
}

export function useGetWETH() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const { Moralis } = useMoralis();

  async function execute(amount: string) {
    try {
      setLoading(true);
      const transaction = await Moralis.transfer({
        type: "native",
        amount,
        receiver: wethOption.contractAddress,
      });
      // @ts-ignore
      const result = await transaction.wait();
      setData(result);
      setLoading(false);
      setError(null);
      return result;
    } catch (error: any) {
      setData(null);
      setLoading(false);
      setError(
        error?.code?.toLowerCase().replaceAll("_", " ") ??
          "deposit WMATIC failed"
      );
      throw new Error(
        error?.code?.toLowerCase().replaceAll("_", " ") ??
          "deposit WMATIC failed"
      );
    }
  }

  return {
    data,
    loading,
    error,
    execute,
  };
}

export function useTransferNFT() {
  const [loading, setLoading] = useState<any>(false);
  const [txPending, setTxPending] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const { Moralis } = useMoralis();

  async function execute(
    from: string,
    to: string,
    tokenId: string,
    contractAddress: string
  ) {
    try {
      if (Moralis.account) {
        setLoading(true);
        const transaction = await Moralis.executeFunction({
          functionName: "safeTransferFrom(address,address,uint256)",
          params: {
            from,
            to,
            tokenId,
          },
          contractAddress,
          ...IERC721Options,
        });
        setTxPending(true);
        // @ts-ignore
        const result = await transaction.wait();
        setTxPending(false);
        setData(result);
        setError(null);
        setLoading(false);
      }
    } catch (error: any) {
      setData(null);
      setLoading(false);
      setTxPending(false);
      var errMsg =
        error.message != "Internal JSON-RPC error."
          ? error.message
          : error.data.message;
      var message = errorMsg[errMsg];
      console.error("transfer NFT failed", error);
      setError(message);
      throw new Error(message);
    }
  }

  return {
    data,
    loading,
    txPending,
    error,
    execute,
  };
}

export function useBurnNFT() {
  const [loading, setLoading] = useState<any>(false);
  const [txPending, setTxPending] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const { Moralis } = useMoralis();

  async function execute(tokenId: string, contractAddress: string) {
    try {
      if (Moralis.account) {
        setLoading(true);
        const transaction = await Moralis.executeFunction({
          functionName: "burn",
          params: {
            tokenId,
          },
          contractAddress,
          abi: vizva721Option.abi,
        });
        setTxPending(true);
        // @ts-ignore
        const result = await transaction.wait();
        setTxPending(false);
        setData(result);
        setError(null);
        setLoading(false);
      }
    } catch (error: any) {
      setData(null);
      console.error("burning NFT failed", error);
      setLoading(false);
      setTxPending(false);
      var errMsg =
        error.message != "Internal JSON-RPC error."
          ? error.message
          : error.data.message;
      var message = errorMsg[errMsg];
      setError(message);
      throw new Error(error ? error.message : "burning NFT failed");
    }
  }

  return {
    data,
    loading,
    txPending,
    error,
    execute,
  };
}

export function useChangePrice() {
  const [loading, setLoading] = useState<any>(false);
  const [txPending, setTxPending] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const { Moralis } = useMoralis();

  async function execute(marketId: string, price: string) {
    try {
      if (Moralis.account) {
        setLoading(true);
        const transaction = await Moralis.executeFunction({
          functionName: "updateSalePrice",
          params: {
            _id: marketId,
            _newValue: price,
          },
          ...vizvaMarketOption,
        });
        setTxPending(true);
        // @ts-ignore
        const result = await transaction.wait();
        setTxPending(false);
        setData(result);
        setError(null);
        setLoading(false);
      }
    } catch (error: any) {
      setData(null);
      setLoading(false);
      setTxPending(false);
      var errMsg =
        error.message != "Internal JSON-RPC error."
          ? error.message
          : error.data.message;
      var message = errorMsg[errMsg];
      setError(message);
      console.error("change Price errored", error);
      throw new Error(message);
    }
  }

  return {
    data,
    loading,
    txPending,
    error,
    execute,
  };
}

export function useGetAllNFTOnSale() {
  const [loading, setLoading] = useState<any>(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const { Moralis } = useMoralis();

  async function execute() {
    try {
      setLoading(true);
      const result = await Moralis.executeFunction({
        functionName: "getAllItemForSale",
        ...vizvaMarketOption,
      });
      // console.log(result);
      setData(result);
      setError(null);
      setLoading(false);
      return result;
    } catch (error: any) {
      setData(null);
      setError(error.message ? error.message : "getAllItemForSale failed");
      setLoading(false);
      throw new Error(
        error.message ? error.message : "getAllItemForSale failed"
      );
    }
  }

  return {
    data,
    loading,
    error,
    execute,
  };
}

export function useGetNFTOnSale() {
  const [loading, setLoading] = useState<any>(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const { Moralis } = useMoralis();

  async function execute(input: string) {
    try {
      setLoading(true);
      const result = await Moralis.executeFunction({
        functionName: "itemsForSale",
        params: {
          input,
        },
        ...vizvaMarketOption,
      });
      // console.log("data:", result);
      setData(result);
      setError(null);
      setLoading(false);
      return result;
    } catch (error: any) {
      // console.log(error);
      setData(null);
      setError(error.message ? error.message : "getAllItemForSale failed");
      setLoading(false);
      // throw new Error(
      //   error.message ? error.message : "getAllItemForSale failed"
      // );
    }
  }

  return {
    data,
    loading,
    error,
    execute,
  };
}

export function useGetUnreadNotificationCount() {
  const [count, setCount] = useState(0);
  const { user } = useMoralis();
  try {
    const { data } = useMoralisQuery(
      "UserActivity",
      (query) => query.equalTo("user", user).equalTo("read", false),
      //.equalTo("notifyUser",true)
      [user],
      {
        live: true,
      }
    );
    useEffect(() => {
      setCount(data?.length);
    }, [data]);
  } catch (error) {
    console.error("getting unread notification count failed", error);
  }

  return {
    count,
  };
}

// export function useValidateBiddingBalance(bid: string) {
//   const [loading, setLoading] = useState<any>(true);
//   const [error, setError] = useState<any>(null);
//   const [data, setData] = useState<boolean>(false);
//   const { Moralis } = useMoralis();

//   async function processData() {
//     try {
//       const { data: wrappedTokenBalance } = useCheckWETHBalance();
//       const parsedBalance = parseInt(wrappedTokenBalance);
//       const parsedBid = parseInt(bid);
//       if (parsedBalance < parsedBid) {
//         const { data: weth } = useGetWETH(
//           (parsedBid - parsedBalance).toString()
//         );
//       }
//       setData(true);
//       setLoading(false);
//       setError(null);
//     } catch (error: any) {
//       setData(false);
//       setLoading(false);
//       setError(error.message);
//     }
//   }

//   useEffect(() => {
//     if (data) return;
//     processData();
//   });

//   return {
//     data,
//     loading,
//     error,
//   };
// }

// export function useUsernameUnique(
//   params: MoralisCloudFunctionParameters & { username: string }
// ) {
//   const [loading, setLoading] = useState<any>(true);
//   const [error, setError] = useState<any>(null);
//   const [data, setData] = useState<boolean>(false);

//   const {
//     data: usernameUnique,
//     error: usernameUniqueError,
//     isLoading,
//   } = useMoralisCloudFunction("isUsernameTaken", { username: params.username });

//   function processData() {
//     console.log(params.username);

//     if (isLoading) {
//       setError(null);
//       setData(false);
//       setLoading(true);
//     }
//     if (usernameUniqueError) {
//       setError(usernameUniqueError.message ?? "failed to process username");
//       setData(false);
//       setLoading(false);
//     }
//     if (usernameUnique) {
//       setError(null);
//       setData(true);
//       setLoading(false);
//     }
//   }
//   useEffect(() => {
//     processData();
//   }, [params.username]);

//   return {
//     data,
//     loading,
//     error,
//   };
// }
