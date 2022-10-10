import React, { useState, useEffect } from "react";
import Head from "../components/Head";
import Header from "../components/Header";
import s from "../styles/App.module.css";
import "@celo/react-celo/lib/styles.css";
import { useRouter } from "next/router";
import { useWallet } from "../hooks/useWallet";
import PaymentForm from "../components/PaymentForm";
import RegistrationForm from "../components/RegistrationForm";
import { useCelo } from "@celo/react-celo";
import carbonPayNftAbi from "../abi/CarbonPayNFT.json";
import c from "../constants/constants";

export default function Pay() {
  const [nav, setNav] = useState(0); // 0 - "pay", 1 - "register"
  const [registered, setRegistered] = useState(false);
  const { kit } = useCelo();
  const wallet = useWallet();

  const isRegistered = async () => {
    if (!wallet.address) return false;
    const contract = new kit.connection.web3.eth.Contract(
      carbonPayNftAbi,
      c.NFT_CONTRACT_ADDRESS
    );
    const balance = await contract.methods.balanceOf(wallet.address).call();
    return balance > 0;
  };

  useEffect(() => {
    (async () => {
      (await isRegistered()) ? setRegistered(true) : setRegistered(false);
    })();
  }, [wallet.address]);

  return (
    <div className={`${s.container} ${nav && s.darkBg}`}>
      <Head />
      <main className={`${s.main}`}>
        <Header {...wallet} registered={registered} />
        <div className={s.content}>
          <ul className={s.nav}>
            <li className={`${s.navItem} ${!nav && s.navItemSelected}`}>
              <a onClick={() => setNav(0)} href="#pay">
                Pay
              </a>
            </li>
            {!registered && (
              <li
                className={`${s.navItem} ${s.registerItem}  ${
                  nav && s.navItemSelected
                }`}
              >
                <a href="#register" onClick={() => setNav(1)}>
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
