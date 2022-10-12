import React, { useRef, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { useCelo } from "@celo/react-celo";
import { nftContract } from "@/services/contracts";
import { WalletContext } from "@/context/WalletContext";
import Form from "@/components/Form";
import useGas from "@/hooks/useGas";

const RegistrationForm = () => {
  const { address, connect } = useContext(WalletContext);
  const { kit } = useCelo();
  const { gas } = useGas();
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

  return (
    <Form>
      <div className="formControl">
        <label className="label">Merchant Name</label>
        <div className="inputWrap">
          <input
            ref={merchantInput}
            placeholder="Jen's Bakery"
            className="input"
            type="text"
          />
        </div>
      </div>
      {/* <div className="formControl">
        <label className="label">Minting Fee</label>
        <div className="subLabel subLabelLarge">+5 CELO</div>
      </div> */}
      <div className="formControl">
        <label className="label">Gas Fee</label>
        <div className="subLabel subLabelLarge">+ {gas} CELO</div>
      </div>
      <button onClick={handleRegister} className="w-full text-lg btn-primary">
        Mint carbonNFT
      </button>
    </Form>
  );
};

export default RegistrationForm;
