import { useState, useEffect, useCallback } from "react";
import Head from "../components/Head";
import Header from "../components/Header";
import s from "../styles/App.module.css";
import "@celo/react-celo/lib/styles.css";
import { useWallet } from "../hooks/useWallet";
import PaymentForm from "../components/PaymentForm";
import RegistrationForm from "../components/RegistrationForm";
import { useCelo } from "@celo/react-celo";
import carbonPayNftAbi from "../abi/CarbonPayNFT.json";
import { NFT_CONTRACT_ADDRESS } from "../constants/constants";

export enum NavState {
  Pay = 0,
  Register = 1,
}

export default function IndexPage() {
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
        <div className={s.content}>
          <ul className={s.nav}>
            <li className={`${s.navItem} ${!nav && s.navItemSelected}`}>
              <a onClick={() => setNav(NavState.Pay)} href="#pay">
                Pay
              </a>
            </li>
            {!registered && (
              <li
                className={`${s.navItem} ${s.registerItem}  ${
                  nav && s.navItemSelected
                }`}
              >
                <a href="#register" onClick={() => setNav(NavState.Register)}>
                  Register Merchant
                </a>
              </li>
            )}
          </ul>
          {!nav ? (
            <PaymentForm {...wallet} />
          ) : (
            <RegistrationForm {...wallet} />
          )}
        </div>
      </main>
    </div>
  );
}
