import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import s from '../styles/App.module.css'
import { CeloProvider, Alfajores, useCelo } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';

export default function WrappedApp() {
  return (
    <CeloProvider
      dapp={{
        name: 'CarbonPay',
        description: 'Fight climate change by doing whatever you do best',
        url: 'https://example.com',
      }}
      defaultNetwork={Alfajores.name}
      connectModal={{
        title: <span>Connect your Wallet</span>,
        providersOptions: { searchable: true }
      }}
    >
      <App/>
    </CeloProvider>
  )
}

function App() {
  const [nav, setNav] = useState(0); // 0 - "pay", 1 - "register"

  const {
    kit,
    address,
    network,
    connect,
    supportsFeeCurrency,
    disconnect,
    performActions,
    walletType,
    feeCurrency,
    updateFeeCurrency,
    updateTheme,
  } = useCelo();

  debugger;

  return (
    <div className={`${s.container} ${nav && s.darkBg}`}>
    <Head>
      <title>CarbonPay</title>
      <meta name="description" content="Fight climate change by doing whatever you do best" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={`${s.main}`}>
      <header className={s.header}>
        <div className={s.headerInner}>
          <div className={s.logo}>
            <Image src="/carbonpay-logo.png" width="256px" height="64px" layout="fixed" />
          </div>
          {address ? <div className={s.btnSection}><button onClick={disconnect} className={s.btn}>Disconnect</button></div> : <div className={s.btnSection}><button onClick={connect} className={s.btn}>Connect Wallet</button></div>}
        </div>
      </header>
      <div className={s.content}>
        <ul className={s.nav}>
          <li className={`${s.navItem} ${s.navItemFirst} ${!nav && s.navItemSelected}`}><a onClick={() => setNav(0)} href="#pay">Pay</a></li>
          <li className={`${s.navItem} ${nav && s.navItemSelected}`}><a href="#register" onClick={() => setNav(1)}>Register Merchant</a></li>
        </ul>

        {!nav ? <div className={s.formWrap}>
          <div className={s.formControl}>
            <label className={s.label}>Merchant ID</label>
            <div className={s.inputWrap}>
              <input placeholder="0x..." className={s.input} type="text" />
              <div className={s.subLabel}>
                Jen's Bakery
              </div>
            </div>
          </div>
          <div className={s.formControl}>
            <label className={s.label}>Payment Amount</label>
            <div className={s.inputWrap}>
              <input placeholder="0" className={s.input} type="text" />
              <div className={s.subLabel}>
                $4.79 USD
              </div>
            </div>
          </div>
          <div className={s.formControl}>
            <label className={s.label}>Gas Fee</label>
            <div className={`${s.subLabel} ${s.subLabelLarge}`}>+0.05 CELO</div>
          </div>
          <button className={`${s.btn} ${s.btnLarge}`}>Authorise Transaction</button>
        </div>
          :
        <div className={s.formWrap}>
          <div className={s.formControl}>
            <label className={s.label}>Merchant Name</label>
            <div className={s.inputWrap}>
              <input placeholder="Jen's Bakery" className={s.input} type="text" />
            </div>
          </div>
          <div className={s.formControl}>
            <label className={s.label}>Minting Fee</label>
            <div className={`${s.subLabel} ${s.subLabelLarge}`}>+5 CELO</div>
          </div>
          <div className={s.formControl}>
            <label className={s.label}>Gas Fee</label>
            <div className={`${s.subLabel} ${s.subLabelLarge}`}>+0.05 CELO</div>
          </div>
          <button className={`${s.btn} ${s.btnLarge}`}>Mint carbonNFT</button>
        </div>}
      </div>
    </main>
  </div>
  )
}
