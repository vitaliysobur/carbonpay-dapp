import { AppProps } from "next/app";
import { CeloProvider, Alfajores } from "@celo/react-celo";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
// TODO: Move to the connect page
import "@celo/react-celo/lib/styles.css";
import { ToastContainer } from "react-toastify";

const CarbonPay = ({ Component, pageProps }: AppProps) => {
  return (
    <CeloProvider
      dapp={{
        icon: "https://carbonpay.io/favicon.ico",
        name: "CarbonPay",
        description: "Fight climate change by doing whatever you do best",
        url: "https://example.com",
      }}
      defaultNetwork={Alfajores.name}
      connectModal={{
        title: <span>Connect your Wallet</span>,
        providersOptions: { searchable: true },
      }}
    >
      <ToastContainer position="top-center" />
      <Component {...pageProps} />
    </CeloProvider>
  );
};

export default CarbonPay;
