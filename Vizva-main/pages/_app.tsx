import CustomThemeProvider from "context/themeContext";
import "../styles/globals.css";
import "../styles/nprogress.css";
import Head from "next/head";
import { useMoralis, MoralisProvider } from "react-moralis";
import Notification from "components/notification";
import Prompt from "components/prompt";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import styled from "@emotion/styled";
import { Provider } from "react-redux";
import { store } from "redux/store";
import nProgress from "nprogress";
import ErrorBoundary from "components/errorBoundary";
import Loading from "components/loading";
import PriceContextProvider from "context/priceContext";

var networkID =
  process.env.APP_ENV == "testnet"
    ? (process.env.TEST_NETWORK_ID as any as number)
    : (process.env.MAINNET_ID as any as number);
const appId = process.env.APP_ID as string;
const serverURL = process.env.MORALIS_URL as string;

function MyApp({ Component, pageProps }: AppProps) {
  const [isInitialized, setIsIntialized] = useState(false);
  useEffect(() => {
    nProgress.done();
  }, []);

  function updateIsInitialized(state: boolean) {
    setIsIntialized(state);
  }
  const homepage =
    process.env.APP_ENV === "testnet"
      ? "https://www.testnet.vizva.io"
      : "https://www.vizva.io";
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <CustomThemeProvider>
          <>
            <MoralisProvider
              appId={appId}
              serverUrl={serverURL}
              initializeOnMount={true}
            >
              <PriceContextProvider>
                <MoralisSetup updateIsInitialized={updateIsInitialized}>
                  <>
                    <Head>
                      <title>Vizva</title>
                      <meta
                        name="description"
                        content="A community-centered marketplace for storytellers to buy, sell and trade art and IP NFTs!"
                      />
                      <link rel="shortcut icon" href="/Favicon.svg" />

                      {/* facebook */}
                      <meta property="og:type" content="website" />
                      <meta property="og:url" content={homepage} />
                      <meta property="og:title" content="Vizva" />
                      <meta
                        property="og:description"
                        content="A community-centered marketplace for storytellers to buy, sell and trade art and IP NFTs!"
                      />
                      <meta
                        property="og:image"
                        content="https://firebasestorage.googleapis.com/v0/b/vizva-boolien.appspot.com/o/logo.png?alt=media&token=1c7ec6bc-623d-4a60-8832-191167e3d134"
                      />

                      {/* twitter */}
                      <meta
                        property="twitter:card"
                        content="summary_large_image"
                      />
                      <meta property="twitter:title" content="Vizva" />
                      <meta
                        property="twitter:image"
                        content="https://firebasestorage.googleapis.com/v0/b/vizva-boolien.appspot.com/o/logo.png?alt=media&token=1c7ec6bc-623d-4a60-8832-191167e3d134"
                      />
                    </Head>
                    <Loading isOpen={!isInitialized} />
                    <Notification />
                    <Component {...pageProps} />
                  </>
                </MoralisSetup>
              </PriceContextProvider>
            </MoralisProvider>
          </>
        </CustomThemeProvider>
      </ErrorBoundary>
    </Provider>
  );
}

export default MyApp;

function MoralisSetup({
  children,
  updateIsInitialized,
}: {
  children: JSX.Element;
  updateIsInitialized(s: boolean): void;
}) {
  const [requestPending, setRequestPending] = useState(false);
  const [logoutRequestPending, setLogoutRequestPending] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [networkChangeError, setNetworkChangeError] = useState(false);
  const [chainID, setChainId] = useState(networkID);
  const [isExtensionFound, setExtensionFound] = useState(true);
  const router = useRouter();

  const {
    isAuthenticated,
    isInitializing,
    isInitialized,
    user,
    isWeb3Enabled,
    isWeb3EnableLoading,
    enableWeb3,
    logout,
    Moralis,
    web3,
  } = useMoralis();

  useEffect(() => {
    updateIsInitialized(isInitialized);
  }, [isInitialized]);

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
      } else {
        updateRequestPending(false);
        // console.error("Network Error:", error);
        setNetworkChangeError(true);
      }
      // if(error.message == 'Cannot call switchNetwork, as it does not exist on connector type "WalletConnect"'){
      //   console.log("adding network")
      // }
    }
  };
  useEffect(() => {
    window.addEventListener("storage", function (event) {
      if (event.key == "logout-event") {
        this.window.location.reload();
      }
    });
  });

  const addNetwork = async () => {
    try {
      let chainId = 137;
      let chainName = "Polygon Mainnet";
      let currencyName = "MATIC";
      let currencySymbol = "MATIC";
      let rpcUrl = "https://polygon-rpc.com/";
      let blockExplorerUrl = "https://polygonscan.com/";
      if (networkID == 80001) {
        chainId = 80001;
        chainName = "Matic Mumbai";
        currencyName = "MATIC";
        currencySymbol = "MATIC";
        rpcUrl = "https://matic-mumbai.chainstacklabs.com";
        blockExplorerUrl = "https://mumbai.polygonscan.com/";
      }
      await Moralis.addNetwork(
        chainId,
        chainName,
        currencyName,
        currencySymbol,
        rpcUrl,
        blockExplorerUrl
      );
      updateRequestPending(false);
    } catch (error: any) {
      updateRequestPending(false);
      console.error(error);
    }
  };
  const logoutUser = async () => {
    try {
      //const userAddress = user?.get("ethAddress");
      setLogoutRequestPending(true);
      await logout();
      localStorage.removeItem("provider");
      localStorage.setItem("logout-event", "logout");
      setNetworkError(false);
      setLogoutRequestPending(false);
      router.replace("/");
    } catch (error: any) {
      console.error(error);
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
    try {
      if (isAuthenticated) {
        if (!localStorage.getItem("provider")) {
          console.error("no provider found ==> logging out user");
          logoutUser();
        }
        if (!isWeb3Enabled && !isWeb3EnableLoading) {
          if (!requestPending) {
            enableWeb3({ provider }).then(() => {
              updateRequestPending(false);
            });
            updateRequestPending(true);
          }
        }
        getChainId();
        if (chainID != networkID) {
          setNetworkError(true);
        } else {
          setNetworkError(false);
        }
        if (user && isWeb3Enabled) {
          Moralis.onChainChanged((_chainId: string | null) =>
            //@ts-ignore
            setChainId(parseInt(_chainId as string, 16))
          );
          Moralis.onAccountChanged(() => {
            console.error("account changed ==> Logging user out");
            logoutUser();
          });
          Moralis.onDisconnect(() => {
            console.error("Disconnected ==> Logging user out");
            logoutUser();
          });
          Moralis.onWeb3Deactivated(() => {
            console.error("web3 deactivated");
            localStorage.removeItem("walletconnect");
          });
          const ethAddress = user.get("ethAddress");
          const selectedAddress =
            localStorage.getItem("provider") == "metamask"
              ? //@ts-ignore
                web3?.provider?.selectedAddress
              : // @ts-ignore
                web3?.provider?.accounts[0];
          if (
            selectedAddress &&
            selectedAddress.toLowerCase() != ethAddress.toLowerCase()
          ) {
            console.error("account changed ==> Logging user out");
            logoutUser();
          }
        }
      }
    } catch (error: any) {
      console.error(error);
    }
  }, [isAuthenticated, user, isWeb3Enabled, isWeb3EnableLoading, chainID]);

  return (
    <StyledBackground>
      {networkError && (
        <Prompt
          title="You are using wrong network"
          message={
            networkChangeError
              ? `OOps!.. Automatic network change failed.Please manually add Polygon ${
                  process.env.APP_ENV == "testnet" ? "Mumbai test" : "Main"
                } network in your wallet and try again.`
              : `Please switch back to Polygon ${
                  process.env.APP_ENV == "testnet" ? "Mumbai test" : "Main"
                } network.`
          }
          text={networkChangeError ? "logout" : "Switch Network"}
          onClick={() => {
            networkChangeError ? logoutUser() : changeNetwork();
          }}
          closeable={false}
        />
      )}
      {!isExtensionFound && (
        <Prompt
          title="No Provider Found"
          message="Please install metamask extension"
          text="Refresh"
          onClick={() => window.location.reload()}
          closeable={false}
        />
      )}
      {children}
    </StyledBackground>
  );
}

const StyledBackground = styled.div`
  span,
  div,
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  a,
  ul,
  li {
    color: ${(props) => props.theme.primary};
  }
  *:focus,
  *:hover {
    outline-color: ${(props) => props.theme.green};
  }
  *::-webkit-scrollbar {
    background-color: transparent;
    width: 16px;
    height: 16px;
  }
  *::-webkit-scrollbar-button {
    display: none;
  }
  *::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.gray3};
    border-radius: 16px;
    border: 5px solid ${(props) => props.theme.background};
    transition: border 150ms ease;

    &:hover {
      border: 3px solid ${(props) => props.theme.background};
    }
  }
  *::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;
