import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import atob from "atob";
import s from "@/styles/App.module.css";
import "@celo/react-celo/lib/styles.css";
import RegistrationForm from "@/components/RegistrationForm";
import CarbonPayNftAbi from "@/abi/CarbonPayNFT.json";
import { AiFillEye, AiFillHeart } from "react-icons/ai";
import { BiStats } from "react-icons/bi";
import { NFT_CONTRACT_ADDRESS } from "@/constants/constants";
import Layout from "@/components/Layout";
import useWallet from "@/hooks/useWallet";
import { AbiItem } from "web3-utils";

export default function Merchant() {
  const [nav, setNav] = useState(0);
  const [metadata, setMetadata] = useState(null);

  const { isRegistered, address, kit } = useWallet();

  const getNftMetadata = useCallback(async () => {
    if (!address) return null;
    const contract = new kit.connection.web3.eth.Contract(
      CarbonPayNftAbi as AbiItem[],
      NFT_CONTRACT_ADDRESS
    );
    const tokenId = await contract.methods.getTokenIdByAddress(address).call();
    const metadata = await contract.methods.tokenURI(tokenId).call();
    const json = atob(metadata.substring(29));
    return JSON.parse(json.replace("},", "}"));
  }, [address, kit.connection.web3.eth.Contract]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const metadata = await getNftMetadata();

      if (isMounted) {
        setMetadata(metadata ?? null);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [getNftMetadata]);

  return (
    <Layout>
      <div className={s.content}>
        <ul className={s.nav}>
          {!isRegistered && (
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
        {!isRegistered && <RegistrationForm {...wallet} />}
        {isRegistered && (
          <div className={s.profileWrap}>
            <div className={s.nftWrap}>
              <div className={s.nft}>
                <Image src="/img/nft.png" width="384" height="522" alt="NFT" />
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
    </Layout>
  );
}
