import React from "react";
import RegistrationForm from "@/components/RegistrationForm";
import Layout from "@/components/Layout";
import useWallet from "@/hooks/useWallet";
import Tabs from "@/components/Tabs";

export default function Register() {
  const { isRegistered } = useWallet();

  return (
    <Layout>
      <Tabs />
      {!isRegistered && <RegistrationForm />}
    </Layout>
  );
}
