import s from '../styles/App.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default ({
  address,
  connect,
  registered
}) => {
  return (
    <header className={s.header}>
      <div className={s.headerInner}>
        <div className={s.logo}>
          <Image src="/carbonpay-logo.png" width="256px" height="64px" layout="fixed" />
        </div>
        {!address && <div className={s.btnSection}><button onClick={connect} className={s.btn}>Connect Wallet</button></div>}
        {registered && <Link href="/merchant"><a className={s.profileLink}>Profile</a></Link>}
      </div>
    </header>
  );
}