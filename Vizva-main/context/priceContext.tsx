import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { createContext, useEffect, useState } from "react";
import { useMoralisWeb3Api } from "react-moralis";

export const PriceContext = createContext<{
  data: {
    "matic-network": {
      usd: number;
    };
  } | null;
  loading: boolean;
}>({
  data: null,
  loading: true,
});

export default function PriceContextProvider(props: {
  children: ReactJSXElement;
}) {
  const [data, setData] = useState<{
    "matic-network": {
      usd: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const Web3Api = useMoralisWeb3Api();

  async function execute() {
    try {
      const price = await Web3Api.token.getTokenPrice({
        address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        chain: "polygon",
        exchange: "quickswap",
      });
      const priceData = {
        "matic-network": {
          usd: price.usdPrice,
        },
      };
      setData(priceData);
      setLoading(false);
    } catch (error: any) {
      // setData(null);
      setLoading(false);
    }
  }

  useEffect(() => {
    execute();
    const interval = setInterval(() => {
      execute();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    data,
    loading,
  };

  return (
    <PriceContext.Provider value={value}>
      {props.children}
    </PriceContext.Provider>
  );
}
