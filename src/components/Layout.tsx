import { ReactNode } from "react";
import Head from "@/components/Head";
import Header from "@/components/Header";
import { useRouter } from "next/router";
interface Props {
  children?: ReactNode;
}

export default function Layout({ children }: Props) {
  const router = useRouter();
  const isHome = router.pathname === "/";

  return (
    <div className={isHome ? "bg-[#5b8f86]" : "bg-[#256659]"}>
      <Head />
      <main className="flex align-start overflow-hidden min-h-screen flex-col">
        <Header />
        <div className="flex pt-10 items-center flex-1 overflow-y-hidden z-10 flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
