import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCelo } from "@celo/react-celo";
import s from "@/styles/App.module.css";
import carbonPayNftAbi from "@/abi/CarbonPayNFT.json";
import { NFT_CONTRACT_ADDRESS } from "@/constants/constants";
import { AbiItem } from "web3-utils";
import useWallet from "@/hooks/useWallet";

const RegistrationForm = () => {
  const { address, connect } = useWallet();

  const { kit } = useCelo();
  const [gas, setGas] = useState(0);
  const merchantInput = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const contract = new kit.connection.web3.eth.Contract(
    carbonPayNftAbi as AbiItem[],
    NFT_CONTRACT_ADDRESS
  );

  const register = async (name?: string) => {
    try {
      await contract.methods.safeMint(address, name).send({ from: address });
      router.push("/merchant");
    } catch (err) {
      console.log(err);
      if (/4001/.test(err)) {
        console.log("Rejected");
      } else {
        !address && (await connect());
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (address) {
        const gasPrice = await kit.connection.web3.eth.getGasPrice();
        const gasEstimate = await contract.methods
          .safeMint(address, name)
          .estimateGas();

        const gas = (Number(gasPrice) * gasEstimate) / 10 ** 18;

        if (isMounted) {
          setGas(gas);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [address, contract.methods, kit.connection.web3.eth]);

  return (
    <div className={s.formWrap}>
      <div className={s.formControl}>
        <label className={s.label}>Merchant Name</label>
        <div className={s.inputWrap}>
          <input
            ref={merchantInput}
            placeholder="Jen's Bakery"
            className={s.input}
            type="text"
          />
        </div>
      </div>
      {/* <div className={s.formControl}>
        <label className={s.label}>Minting Fee</label>
        <div className={`${s.subLabel} ${s.subLabelLarge}`}>+5 CELO</div>
      </div> */}
      <div className={s.formControl}>
        <label className={s.label}>Gas Fee</label>
        <div className={`${s.subLabel} ${s.subLabelLarge}`}>+ {gas} CELO</div>
      </div>
      <button
        onClick={() => register(merchantInput?.current?.value)}
        className={`${s.btn} ${s.btnLarge}`}
      >
        Mint carbonNFT
      </button>
    </div>
  );
};

export default RegistrationForm;
