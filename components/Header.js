import s from '../styles/App.module.css';
import Image from 'next/image';

export default ({
  address,
  connect,
  disconnect,
  registered
}) => {
  return (
    <header className={s.header}>
      <div className={s.headerInner}>
        <div className={s.logo}>
          <Image src="/carbonpay-logo.png" width="256px" height="64px" layout="fixed" />
        </div>
        {registered && <a className={s.profileLink} href="#profile">Profile</a>}
        {address ? <div className={s.btnSection}><button onClick={disconnect} className={s.btn}>Disconnect</button></div> : <div className={s.btnSection}><button onClick={connect} className={s.btn}>Connect Wallet</button></div>}
      </div>
    </header>
  );
}