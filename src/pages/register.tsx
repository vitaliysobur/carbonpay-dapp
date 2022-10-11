import React from "react";
import s from "@/styles/App.module.css";
import RegistrationForm from "@/components/RegistrationForm";
import Layout from "@/components/Layout";
import useWallet from "@/hooks/useWallet";
import Tabs from "@/components/Tabs";

export default function Register() {
  const { isRegistered } = useWallet();

  return (
    <Layout>
      <div className={s.content}>
        <Tabs />
        {!isRegistered && <RegistrationForm />}
      </div>
    </Layout>
  );
}
