import React, { useContext, useState } from "react";
import { WalletContext } from "@/context/WalletContext";
import Form from "@/components/Form";
import { Formik, Field, ErrorMessage } from "formik";
import useGas from "@/hooks/useGas";

const PaymentForm = () => {
  const { pay, isValidAddress, getMerchantName } = useContext(WalletContext);
  const { gas } = useGas();
  const [name, setName] = useState("");

  const validateMerchant = async (address: string) => {
    if (!isValidAddress(address)) {
      setName("");
      return "Invalid address";
    }

    try {
      const merchantName = await getMerchantName(address);
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
            <ErrorMessage
              name="merchant"
              component="span"
              className="text-red-500"
            />
          </div>
        </div>
        <div className="formControl">
          <label className="label">Payment Amount</label>
          <div className="inputWrap">
            <Field
              type="string"
              name="amount"
              className="input"
              placeholder="0"
              validate={(value: string) => {
                const amount = parseFloat(value);
                if (isNaN(amount)) {
                  return "Invalid amount";
                }

                if (amount <= 0) {
                  return "Amount must be greater than 0";
                }
              }}
            />
            <p className="subLabel">$4.79 USD</p>
            <ErrorMessage
              name="amount"
              component="div"
              className="text-red-500"
            />
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
