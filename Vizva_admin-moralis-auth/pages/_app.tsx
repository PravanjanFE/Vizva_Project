import SideNav from "../components/SideNav";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProtectedRoutes from "../components/ProtectedRoutes";
import "../styles/globals.css";
import "../public/static/plugins/jquery-ui/jquery-ui.min.css";

import type { AppProps } from "next/app";
import { MoralisSetup } from "../components/moralis";
import { MoralisProvider } from "react-moralis";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const appId = process.env.APP_ID as string;
  const serverURL = process.env.MORALIS_URL as string;
  const router = useRouter();

  return (
    <>
      <MoralisProvider
        appId={appId}
        serverUrl={serverURL}
        initializeOnMount={true}
      >
        <MoralisSetup>
          <ProtectedRoutes>
            {router.pathname !== "/login" && <SideNav />}
            {router.pathname !== "/login" && <Header />}
            <Component {...pageProps} />
          </ProtectedRoutes>
        </MoralisSetup>
      </MoralisProvider>
      {router.pathname !== "/login" && <Footer />}
    </>
  );
}

export default MyApp;
