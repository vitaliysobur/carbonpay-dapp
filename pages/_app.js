import { CeloProvider, Alfajores } from '@celo/react-celo';
import '../styles/globals.css'

const CarbonPay = ({ Component, pageProps }) => {

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
      <Component {...pageProps} />
    </CeloProvider>
  )
}

export default CarbonPay
