import Head from 'next/head'
import Image from 'next/image'
import s from '../styles/App.module.css'

export default function App() {
  return (
    <div className={s.container}>
      <Head>
        <title>CarbonPay</title>
        <meta name="description" content="Fight climate change by doing whatever you do best" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={s.main}>
        <header className={s.header}>
          <div className={s.headerInner}>
            <div className={s.logo}>
              <Image src="/carbonpay-logo.png" width="256px" height="64px" layout="fixed" />
            </div>
            <div className={s.btnSection}><button className={s.btn}>Connect Wallet</button></div>
          </div>
        </header>
        <div className={s.content}></div>
      </main>
    </div>
  )
}
