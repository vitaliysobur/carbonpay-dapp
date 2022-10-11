import React, { useEffect, useRef, useState } from "react";
import s from "@/styles/App.module.css";
import { TOKEN_ADDRESS } from "@/constants/constants";
import { toast } from "react-toastify";

import useWallet from "@/hooks/useWallet";
import {
  getGas,
  getMerchantName,
  isValidAddress,
  paymentProcessorContract,
} from "@/services/contracts";
import TransactionLink from "@/components/TransactionLink";

const PaymentForm = () => {
  const { address, connect, kit } = useWallet();
  const [gas, setGas] = useState(0);
  const [name, setName] = useState("");
  const merchantIdInput = useRef<HTMLInputElement>(null);
  const paymentAmountInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;

    const updateGas = async () => {
      if (address) {
        const gas = await getGas(kit, address);

        if (isMounted) {
          setGas(gas);
        }
      }
    };

    updateGas();

    return () => {
      isMounted = false;
    };
  }, [address, kit]);

  const pay = async (merchantAddress?: string, amount?: string) => {
    try {
      if (!amount) {
        return;
      }

      await paymentProcessorContract(kit)
        .methods.pay(
          merchantAddress,
          TOKEN_ADDRESS,
          kit.connection.web3.utils.toWei(amount, "ether")
        )
        .send({ from: address })
        .on("transactionHash", function (hash: string) {
          toast.info(() => <TransactionLink hash={hash} />);
        });
    } catch (err) {
      console.log(err);
      if (/4001/.test(err as string)) {
        console.log("Rejected");
      } else {
        !address && (await connect());
      }
    }
  };

  const showName = async (address?: string) => {
    if (!address) return;

    if (!isValidAddress(kit, address)) {
      return setName("");
    }

    try {
      const name = await getMerchantName(kit, address);
      setName(name);
    } catch (err) {
      console.log(err);
      setName("");
    }
  };

  return (
    <div className={s.formWrap}>
      <div className={s.formControl}>
        <label className={s.label}>Merchant ID</label>
        <div className={s.inputWrap}>
          <input
            ref={merchantIdInput}
            onBlur={() => showName(merchantIdInput?.current?.value)}
            placeholder="0x..."
            className={s.input}
            type="text"
          />
          <div className={s.subLabel}>{name}</div>
        </div>
      </div>
      <div className={s.formControl}>
        <label className={s.label}>Payment Amount</label>
        <div className={s.inputWrap}>
          <input
            ref={paymentAmountInput}
            placeholder="0"
            className={s.input}
            type="text"
          />
          <div className={s.subLabel}>$4.79 USD</div>
        </div>
      </div>
      <div className={s.formControl}>
        <label className={s.label}>Gas Fee</label>
        <div className={`${s.subLabel} ${s.subLabelLarge}`}>+ {gas} CELO</div>
      </div>
      <button
        onClick={() =>
          pay(
            merchantIdInput?.current?.value,
            paymentAmountInput?.current?.value
          )
        }
        className={`${s.btn} ${s.btnLarge}`}
      >
        Authorize Transaction
      </button>
    </div>
  );
};

export default PaymentForm;
