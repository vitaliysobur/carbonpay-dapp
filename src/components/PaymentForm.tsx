import React, { useContext, useEffect, useRef, useState } from "react";
import { TOKEN_ADDRESS } from "@/constants/constants";
import { toast } from "react-toastify";
import {
  getGas,
  getMerchantName,
  isValidAddress,
  paymentProcessorContract,
} from "@/services/contracts";
import { WalletContext } from "@/context/WalletContext";
import TransactionLink from "@/components/TransactionLink";
import Form from "@/components/Form";
import { Formik, Field, ErrorMessage } from "formik";

const PaymentForm = () => {
  const { address, connect, kit } = useContext(WalletContext);
  const [gas, setGas] = useState(0);
  const [name, setName] = useState("");

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

  const pay = async (merchantAddress: string, amount: string) => {
    try {
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

  const validateMerchant = async (address: string) => {
    if (!isValidAddress(kit, address)) {
      setName("");
      return "Invalid address";
    }

    try {
      const merchantName = await getMerchantName(kit, address);
      setName(merchantName);
    } catch (err) {
      setName("");
      return "Merchant not found";
    }
  };

  return (
    <Formik
      initialValues={{ merchant: "", amount: "" }}
      onSubmit={async (values) => {
        await pay(values.merchant, values.amount);
      }}
    >
      <Form>
        <div className="formControl">
          <label className="label">Merchant ID</label>
          <div className="inputWrap">
            <Field
              type="text"
              name="merchant"
              className="input"
              placeholder="0x..."
              validate={validateMerchant}
            />

            <div className="subLabel">{name}</div>
            <ErrorMessage name="merchant" component="span" />
          </div>
        </div>
        <div className="formControl">
          <label className="label">Payment Amount</label>
          <div className="inputWrap">
            <Field
              type="number"
              name="amount"
              className="input"
              placeholder="0"
              validate={(value: number) =>
                value > 1 ? undefined : "The minimum amount is 1$"
              }
            />
            <p className="subLabel">$4.79 USD</p>
            <ErrorMessage name="amount" component="div" />
          </div>
        </div>
        <div className="formControl">
          <label className="label">Gas Fee</label>
          <div className="subLabel subLabelLarge">+ {gas} CELO</div>
        </div>
        <button type="submit" className="w-full text-lg btn-primary">
          Authorize Transaction
        </button>
      </Form>
    </Formik>
  );
};

export default PaymentForm;
