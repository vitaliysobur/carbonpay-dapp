import React, { useContext } from "react";
import RegistrationForm from "@/components/RegistrationForm";
import Layout from "@/components/Layout";
import Tabs from "@/components/Tabs";
import { WalletContext } from "@/context/WalletContext";

export default function Register() {
  const { isRegistered } = useContext(WalletContext);

  return (
    <Layout>
      <Tabs />
      {!isRegistered && <RegistrationForm />}
    </Layout>
  );
}
