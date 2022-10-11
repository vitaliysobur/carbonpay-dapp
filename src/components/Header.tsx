import s from "../styles/App.module.css";
import Link from "next/link";
import Image from "next/image";

interface IProps {
  address?: string;
  connect: () => void;
  registered: boolean;
}

const Header = ({ address, connect, registered }: IProps) => {
  return (
    <header className={s.header}>
      <div className={s.headerInner}>
        <Link href="/">
          <a className={s.logo}>
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
          <div className={s.btnSection}>
            <button onClick={connect} className={s.btn}>
              Connect Wallet
            </button>
          </div>
        )}
        {registered && (
          <Link href="/merchant">
            <a className={s.profileLink}>Profile</a>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
