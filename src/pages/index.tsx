import { useState } from "react";
import s from "@/styles/App.module.css";
import "@celo/react-celo/lib/styles.css";
import PaymentForm from "@/components/PaymentForm";
import RegistrationForm from "@/components/RegistrationForm";
import Layout from "@/components/Layout";
import useWallet from "@/hooks/useWallet";

export enum NavState {
  Pay = 0,
  Register = 1,
}

export default function IndexPage() {
  const [nav, setNav] = useState(NavState.Pay);
  const { isRegistered } = useWallet();

  return (
    <Layout>
      <div className={s.content}>
        <ul className={s.nav}>
          <li className={`${s.navItem} ${!nav && s.navItemSelected}`}>
            <a onClick={() => setNav(NavState.Pay)} href="#pay">
              Pay
            </a>
          </li>
          {!isRegistered && (
            <li
              className={`${s.navItem} ${s.registerItem}  ${
                nav && s.navItemSelected
              }`}
            >
              <a href="#register" onClick={() => setNav(NavState.Register)}>
                Register Merchant
              </a>
            </li>
          )}
        </ul>
        {!nav ? <PaymentForm /> : <RegistrationForm />}
      </div>
    </Layout>
  );
}
