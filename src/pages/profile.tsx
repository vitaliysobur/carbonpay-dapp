import React, { useState, useEffect, useCallback, useContext } from "react";
import Image from "next/image";
import atob from "atob";
import { AiFillEye, AiFillHeart } from "react-icons/ai";
import { BiStats } from "react-icons/bi";
import Layout from "@/components/Layout";
import { nftContract } from "@/services/contracts";
import { WalletContext } from "@/context/WalletContext";

export default function Profile() {
  // TODO: fix types of metadata
  const [metadata, setMetadata] = useState<any>(null);
  const { isRegistered, address, kit } = useContext(WalletContext);

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
      {isRegistered && (
        <div className="flex w-full flex-col align-top md:flex-row ">
          <div className="flex-[1] justify-center flex">
            <Image
              src="/img/nft.png"
              width="384"
              height="522"
              alt="NFT"
              className="rounded-lg"
            />
          </div>

          <div className="p-5 flex-[2]">
            <h2 className="text-4xl text-white">{metadata?.name}</h2>
            <ul className="mt-5 mb-2 text-white">
              <li>
                Owned by <b>0xadf234</b>
              </li>
              <li>
                <AiFillEye fontSize="20px" className="inline" />{" "}
                <span>13,177 views</span>
              </li>
              <li>
                <AiFillHeart fontSize="20px" className="inline" />{" "}
                <span>6003 favorite</span>
              </li>
            </ul>

            <h3 className="text-2xl text-yellow-400">
              <span className="text-xl text-white">Total CO2 offset:</span>{" "}
              {metadata?.attributes[0].value} tons
            </h3>
            <div className="py-5 rounded-xl text-white">
              <header className="p-2 border border-solid border-white flex">
                <BiStats fontSize="20px" className="inline mr-2" />
                <span>Offset History</span>
              </header>

              <section className="flex items-center min-h-[250px] w-full border border-solid border-white">
                <div className="text-center w-full">Empty offset history</div>
              </section>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
