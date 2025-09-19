import { useState } from "react";
import { useMoralis } from "react-moralis";
import { vizvaMarketOption, wethOption, IERC20Options } from "config";
import { ethers } from "ethers";
import LazyBidder from "services/Bidder";

export function useCreateLazyBid() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const { Moralis, web3 } = useMoralis();

  async function execute(
    tokenAddress: string,
    tokenId: string,
    marketId: string,
    bid: string
  ) {
    try {
      setLoading(true);
      const ethersProvider = web3;
      const signer = ethersProvider?.getSigner();
      let chainIdBN = await Moralis.executeFunction({
        functionName: "getChainID",
        ...vizvaMarketOption,
      });
      const chainInWei = Moralis.Units.FromWei(chainIdBN.toString());
      const chainId = ethers.utils.parseUnits(chainInWei.toString());
      const lazyBidder = new LazyBidder({
        contract: new ethers.Contract(
          vizvaMarketOption.contractAddress,
          vizvaMarketOption.abi,
          signer
        ),
        signer: signer as ethers.providers.JsonRpcSigner,
        chainId,
      });
      const voucher = await lazyBidder.createBidVoucher(
        wethOption.contractAddress,
        tokenAddress,
        tokenId,
        marketId,
        bid
      );
      setData(voucher);
      setLoading(false);
      setError(null);
      return voucher;
    } catch (error: any) {
      setData(null);
      setLoading(false);
      setError(
        error?.code?.toLowerCase().replaceAll("_", " ") ??
          "creating bid voucher failed"
      );
      throw new Error(
        error?.code?.toLowerCase().replaceAll("_", " ") ??
          "creating bid voucher failed"
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

export function useValidateWETHBalance() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<boolean>(false);
  const { Moralis } = useMoralis();

  async function execute(bidInWei: string) {
    try {
      setLoading(true);
      const balance = await Moralis.executeFunction({
        functionName: "balanceOf",
        params: {
          account: Moralis.account,
        },
        contractAddress: wethOption.contractAddress,
        ...IERC20Options,
      });
      const balanceInt = parseInt(balance as unknown as string);
      const bidInt = parseInt(bidInWei);
      if (balanceInt > bidInt) {
        setData(true);
        setError(null);
        setLoading(false);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("getting WMATIC balance failed", error);
      setData(false);
      setLoading(false);
      setError(
        error?.code?.toLowerCase().replaceAll("_", " ") ??
          "getting WMATIC balance failed"
      );
      throw new Error(
        error?.code?.toLowerCase().replaceAll("_", " ") ??
          "getting WMATIC balance failed"
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

export function useCheckAndGetWETHApproval() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<boolean>(false);
  const { Moralis } = useMoralis();

  async function execute(amount: string) {
    try {
      setLoading(true);
      const allowance = await Moralis.executeFunction({
        functionName: "allowance",
        params: {
          owner: Moralis.account,
          spender: vizvaMarketOption.contractAddress,
        },
        contractAddress: wethOption.contractAddress,
        ...IERC20Options,
      });
      const allowanceInt = parseInt(allowance as unknown as string);
      const amountInt = parseInt(amount);
      if (allowanceInt < amountInt) {
        const transaction = await Moralis.executeFunction({
          functionName: "approve",
          params: {
            spender: vizvaMarketOption.contractAddress,
            amount,
          },
          contractAddress: wethOption.contractAddress,
          ...IERC20Options,
        });
        //@ts-ignore
        const result = await transaction.wait();
      }
      setData(true);
      setLoading(false);
      setError(null);
      return true;
    } catch (error: any) {
      console.error("checking allowance failed", error);
      setData(false);
      setLoading(false);
      setError(
        error?.code?.toLowerCase().replaceAll("_", " ") ??
          "checking allowance failed"
      );
      throw new Error(
        error?.code?.toLowerCase().replaceAll("_", " ") ??
          "checking allowance failed"
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
