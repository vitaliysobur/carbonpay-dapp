import { useState, useEffect, useCallback, ReactNode } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useCelo } from "@celo/react-celo";
import carbonPayNftAbi from "@/abi/CarbonPayNFT.json";
import Head from "@/components/Head";
import Header from "@/components/Header";
import s from "@/styles/App.module.css";
import "@celo/react-celo/lib/styles.css";
import { NFT_CONTRACT_ADDRESS } from "@/constants/constants";

export enum NavState {
  Pay = 0,
  Register = 1,
}

interface Props {
  children?: ReactNode;
}

export default function Layout({ children }: Props) {
  const [nav, setNav] = useState(NavState.Pay);
  const [registered, setRegistered] = useState(false);
  const { kit } = useCelo();
  const wallet = useWallet();

  const isRegistered = useCallback(async () => {
    if (!wallet.address) return false;

    const contract = new kit.connection.web3.eth.Contract(
      carbonPayNftAbi,
      NFT_CONTRACT_ADDRESS
    );
    const balance = await contract.methods.balanceOf(wallet.address).call();
    return balance > 0;
  }, [kit.connection.web3.eth.Contract, wallet.address]);

  useEffect(() => {
    (async () => {
      setRegistered(await isRegistered());
    })();
  }, [isRegistered, wallet.address]);

  return (
    <div className={`${s.container} ${nav && s.darkBg}`}>
      <Head />
      <main className={`${s.main}`}>
        <Header {...wallet} registered={registered} />
        {children}
      </main>
    </div>
  );
}
