import React, { useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { useCelo } from "@celo/react-celo";
import { nftContract } from "@/services/contracts";
import { WalletContext } from "@/context/WalletContext";
import Form from "@/components/Form";
import useGas from "@/hooks/useGas";
import { Formik, Field, ErrorMessage } from "formik";

const RegistrationForm = () => {
  const { address, connect } = useContext(WalletContext);
  const { kit } = useCelo();
  const { gas } = useGas();
  const router = useRouter();

  const handleRegister = useCallback(
    async (merchantName: string) => {
      try {
        await nftContract(kit)
          .methods.safeMint(address, merchantName)
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
    },
    [address, connect, kit, router]
  );

  return (
    <Formik
      initialValues={{ merchantName: "" }}
      onSubmit={async (values) => {
        await handleRegister(values.merchantName);
      }}
    >
      <Form>
        <div className="formControl">
          <label className="label">Merchant Name</label>
          <div className="inputWrap">
            <Field
              name="merchantName"
              placeholder="Jen's Bakery"
              className="input"
              type="text"
              validate={(value: string) => (!value ? "Required" : undefined)}
            />
          </div>
          <ErrorMessage
            name="merchantName"
            component="div"
            className="text-red-500"
          />
        </div>
        {/* <div className="formControl">
        <label className="label">Minting Fee</label>
        <div className="subLabel subLabelLarge">+5 CELO</div>
      </div> */}
        <div className="formControl">
          <label className="label">Gas Fee</label>
          <div className="subLabel subLabelLarge">+ {gas} CELO</div>
        </div>
        <button type="submit" className="w-full text-lg btn-primary">
          Mint carbonNFT
        </button>
      </Form>
    </Formik>
  );
};

export default RegistrationForm;
