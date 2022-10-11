import { useState, ReactNode } from "react";
import Head from "@/components/Head";
import Header from "@/components/Header";
import s from "@/styles/App.module.css";
import "@celo/react-celo/lib/styles.css";

export enum NavState {
  Pay = 0,
  Register = 1,
}

interface Props {
  children?: ReactNode;
}

export default function Layout({ children }: Props) {
  const [nav, setNav] = useState(NavState.Pay);

  return (
    <div className={`${s.container} ${nav && s.darkBg}`}>
      <Head />
      <main className={`${s.main}`}>
        <Header />
        {children}
      </main>
    </div>
  );
}
