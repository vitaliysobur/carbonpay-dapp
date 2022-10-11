import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useRouter } from "next/router";
import { useCelo } from "@celo/react-celo";
import s from "@/styles/App.module.css";
import { getGas, nftContract } from "@/services/contracts";
import { WalletContext } from "@/context/WalletContext";

const RegistrationForm = () => {
  const { address, connect } = useContext(WalletContext);

  const { kit } = useCelo();
  const [gas, setGas] = useState(0);
  const merchantInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleRegister = useCallback(async () => {
    const name = merchantInput?.current?.value;
    if (!name) {
      return;
    }

    try {
      await nftContract(kit)
        .methods.safeMint(address, name)
        .send({ from: address });
      router.push("/profile");
    } catch (err) {
      console.log(err);
      if (/4001/.test(err as string)) {
        console.log("Rejected");
      } else {
        !address && (await connect());
      }
    }
  }, [address, connect, kit, router]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (address) {
        const gas = await getGas(kit, address);

        if (isMounted) {
          setGas(gas);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [address, kit]);

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
      <button onClick={handleRegister} className={`${s.btn} ${s.btnLarge}`}>
        Mint carbonNFT
      </button>
    </div>
  );
};

export default RegistrationForm;
