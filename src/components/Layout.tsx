import { ReactNode } from "react";
import Head from "@/components/Head";
import Header from "@/components/Header";
import s from "@/styles/App.module.css";
interface Props {
  children?: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className={`${s.container} ${s.darkBg}`}>
      <Head />
      <main className={`${s.main}`}>
        <Header />
        <div className={s.content}>{children}</div>
      </main>
    </div>
  );
}
