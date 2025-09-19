import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

interface Props {
  children: React.ReactNode;
}
export default function MoralisSetup(props: Props) {
  var networkID =
    process.env.NODE_ENV == "development"
      ? (process.env.DEV_NETWORK_ID as any as number)
      : (process.env.MAINNET_ID as any as number);

  const appId = process.env.APP_ID as string;
  const serverURL = process.env.MORALIS_URL as string;
  const [requestPending, setRequestPending] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [chainID, setChainId] = useState(networkID);
  const [isExtensionFound, setExtensionFound] = useState(true);
  const router = useRouter();

  const {
    isAuthenticated,
    user,
    isWeb3Enabled,
    isWeb3EnableLoading,
    enableWeb3,
    logout,
    Moralis,
    web3,
  } = useMoralis();

  const provider = (function () {
    if (typeof window !== "undefined") {
      return localStorage.getItem("provider") as
        | "metamask"
        | "walletconnect"
        | "walletConnect"
        | "wc";
    }
    return;
  })();

  function updateRequestPending(value: boolean) {
    setRequestPending(value);
  }

  const changeNetwork = async () => {
    try {
      if (!requestPending && networkID) {
        updateRequestPending(true);
        await Moralis.switchNetwork(networkID);
        updateRequestPending(false);
      }
    } catch (error: any) {
      if (error?.code == 4902) {
        addNetwork();
      }
      updateRequestPending(false);
      console.log(error.message);
    }
  };

  const addNetwork = async () => {
    try {
      const chainId = 4;
      const chainName = "Rinkeby Testnet";
      const currencyName = "ETHEREUM";
      const currencySymbol = "ETH";
      const rpcUrl =
        "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
      const blockExplorerUrl = "https://rinkeby.etherscan.io";
      await Moralis.addNetwork(
        chainId,
        chainName,
        currencyName,
        currencySymbol,
        rpcUrl,
        blockExplorerUrl
      );
    } catch (error: any) {
      updateRequestPending(false);
      console.log(error.message);
    }
  };
  const logoutUser = async () => {
    try {
      router.replace("/");
      updateRequestPending(true);
      if (!requestPending) {
        logout().then(() => {
          console.log(`userLoggedOut:${user?.get("ethAddress")}`);
          localStorage.removeItem("provider");
          updateRequestPending(false);
        });
      }
    } catch (error: any) {
      console.error(error);
      updateRequestPending(false);
    }
  };

  const getChainId = async () => {
    try {
      if (isWeb3Enabled) {
        const network = await web3?.getNetwork();
        if (network) {
          setChainId(network?.chainId);
        }
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    // try {
    //   if (isAuthenticated) {
    //     if (!localStorage.getItem("provider")) {
    //       console.log("no provider found");
    //       logoutUser();
    //     }
    //     if (!isWeb3Enabled && !isWeb3EnableLoading) {
    //       enableWeb3({ provider });
    //     }
    //     getChainId();
    //     if (chainID != networkID) {
    //       setNetworkError(true);
    //     } else {
    //       setNetworkError(false);
    //     }
    //     if (user && isWeb3Enabled) {
    //       Moralis.onChainChanged((_chainId) =>
    //         //@ts-ignore
    //         setChainId(parseInt(_chainId as string, 16))
    //       );
    //       Moralis.onAccountChanged(() => {
    //         console.log("account changed");
    //         logoutUser();
    //       });
    //       Moralis.onDisconnect(() => {
    //         console.log("Disconnected");
    //         logoutUser();
    //       });
    //       const ethAddress = user.get("ethAddress");
    //       const selectedAddress =
    //         localStorage.getItem("provider") == "metamask"
    //           ? //@ts-ignore
    //             web3?.provider?.selectedAddress
    //           : // @ts-ignore
    //             web3?.provider?.accounts[0];
    //       if (
    //         selectedAddress &&
    //         selectedAddress.toLowerCase() != ethAddress.toLowerCase()
    //       ) {
    //         logoutUser();
    //       }
    //     }
    //   }
    // } catch (error: any) {
    //   console.log(error.message);
    // }
  }, [isAuthenticated, user, isWeb3Enabled, isWeb3EnableLoading, chainID]);
  return <>{props.children}</>;
}
