import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { WalletContext } from "@/context/WalletContext";

const Header = () => {
  const { isRegistered, address, connect } = useContext(WalletContext);

  return (
    <header className="flex flex-nowrap flex-row w-full justify-center">
      <div className="grid p-0 grid-cols-[1fr_200px] justify-between items-center w-full z-20">
        <Link href="/">
          <a className="flex p-0 items-center justify-start w-fit">
            <Image
              alt="CarbonPay logo"
              src="/img/carbonpay-logo.png"
              width="256px"
              height="64px"
              layout="fixed"
            />
          </a>
        </Link>

        {!address && (
          <div className="flex flex-row justify-between md:self-center p-4 fixed bottom-0 left-0 z-50 h-20 md:auto md:static">
            <button onClick={connect} className="btn-primary">
              Connect Wallet
            </button>
          </div>
        )}
        {isRegistered && (
          <Link href="/profile">
            <a className="text-white text-lg text-center">Profile</a>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
