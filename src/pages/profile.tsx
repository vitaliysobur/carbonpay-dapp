import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import atob from "atob";
import s from "@/styles/App.module.css";
import { AiFillEye, AiFillHeart } from "react-icons/ai";
import { BiStats } from "react-icons/bi";
import Layout from "@/components/Layout";
import useWallet from "@/hooks/useWallet";
import { nftContract } from "@/services/contracts";

export default function Profile() {
  // TODO: fix types of metadata
  const [metadata, setMetadata] = useState<any>(null);
  const { isRegistered, address, kit } = useWallet();

  const getNftMetadata = useCallback(async () => {
    if (!address) return null;
    const contract = nftContract(kit);
    const tokenId = await contract.methods.getTokenIdByAddress(address).call();
    const metadata = await contract.methods.tokenURI(tokenId).call();
    const json = atob(metadata.substring(29));
    return JSON.parse(json.replace("},", "}"));
  }, [address, kit]);

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
