import { useEffect, useState } from "react";
import { usefetchPairPrice } from "./useServices";

export default function useFiat(price: number, currency?: string) {
  const [fiatValue, setFiatValue] = useState(0);
  const { data: priceData } = usefetchPairPrice();
  const [fiat, setFiat] = useState("0");

  useEffect(() => {
    if (priceData) {
      setFiatValue(priceData?.["matic-network"]?.usd);
    }
  }, [priceData]);

  useEffect(() => {
    setFiat((price * fiatValue).toFixed(3));
  }, [fiatValue, price]);

  return { fiat };
}
