import React, { useState, useEffect } from "react";
import Image from "next/image";
import atob from "atob";
import Head from "../components/Head";
import Header from "../components/Header";
import s from "../styles/App.module.css";
import "@celo/react-celo/lib/styles.css";
import { useWallet } from "../hooks/useWallet";
import RegistrationForm from "../components/RegistrationForm";
import { useCelo } from "@celo/react-celo";
import carbonPayNftAbi from "../abi/CarbonPayNFT.json";
import { AiFillEye, AiFillHeart } from "react-icons/ai";
import { BiStats } from "react-icons/bi";
import c from "../constants/constants";

export default function Profile() {
  const [nav, setNav] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [metadata, setMetadata] = useState(null);
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

  const getNftMetadata = async () => {
    if (!wallet.address) return null;
    const contract = new kit.connection.web3.eth.Contract(
      carbonPayNftAbi,
      c.NFT_CONTRACT_ADDRESS
    );
    const tokenId = await contract.methods
      .getTokenIdByAddress(wallet.address)
      .call();
    const metadata = await contract.methods.tokenURI(tokenId).call();
    const json = atob(metadata.substring(29));
    return JSON.parse(json.replace("},", "}"));
  };

  useEffect(() => {
    (async () => {
      (await isRegistered()) ? setRegistered(true) : setRegistered(false);

      const metadata = await getNftMetadata();
      metadata ? setMetadata(metadata) : setMetadata(null);
    })();
  }, [wallet.address]);

  return (
    <div className={`${s.container} ${nav && s.darkBg}`}>
      <Head />
      <main className={`${s.main}`}>
        <Header {...wallet} registered={registered} />
        <div className={s.content}>
          <ul className={s.nav}>
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
          {!registered && <RegistrationForm {...wallet} />}
          {registered && (
            <div className={s.profileWrap}>
              <div className={s.nftWrap}>
                <div className={s.nft}>
                  <Image src="/nft.png" width="384" height="522" />
                </div>
              </div>
              <div className={s.profileDetails}>
                <h2 className={s.profileTitle}>{metadata?.name}</h2>
                <ul className={s.profileStats}>
                  <li>
                    Owned by <b>0xadf234</b>
                  </li>
                  <li>
                    <AiFillEye fontSize="20px" /> <span>13,177 views</span>
                  </li>
                  <li>
                    <AiFillHeart fontSize="20px" /> <span>6003 favorite</span>
                  </li>
                </ul>
                <h3 className={s.offset}>
                  <span className={s.offsetTitle}>Total CO2 offset:</span>{" "}
                  {metadata?.attributes[0].value} tons
                </h3>
                <div className={s.transactions}>
                  <header>
                    <span>
                      <BiStats fontSize="20px" />
                    </span>
                    <span>Offset History</span>
                  </header>
                  <section>
                    <div>Empty offset history</div>
                  </section>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
