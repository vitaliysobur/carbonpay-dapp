import React, { useEffect, useRef, useState } from 'react';
import {Link} from 'next/link';
import { useRouter } from 'next/router';
import { useCelo } from '@celo/react-celo';
import s from '../styles/App.module.css';
import carbonPayProcessorAbi from '../abi/CarbonPayProcessor.json';
import carbonPayNftAbi from '../abi/CarbonPayNFT.json';
import c from '../constants/constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default ({
  address,
  connect
}) => {
  const { kit } = useCelo();
  const [gas, setGas] = useState(0);
  const [name, setName] = useState('');
  const merchantIdInput = useRef();
  const paymentAmountInput = useRef();
  const paymentProcessorContract = new kit.connection.web3.eth.Contract(carbonPayProcessorAbi, c.PAY_PROCESSOR_ADDRESS);
  const nftContract = new kit.connection.web3.eth.Contract(carbonPayNftAbi, c.NFT_CONTRACT_ADDRESS);

  useEffect(() => {
    (async () => {
      const gasPrice = await kit.connection.web3.eth.getGasPrice();
      const gasEstimate = await paymentProcessorContract.methods.pay(address, c.TOKEN_ADDRESS, kit.connection.web3.utils.toWei('0', 'ether')).estimateGas();
      const gas = (gasPrice * gasEstimate) / (10 ** 18);
      setGas(gas);
    })()
  }, [address]);

  const getTransactionLink = hash => {
    return (
      <div>
        <Link href={`https://alfajores-blockscout.celo-testnet.org/tx/${hash}/token-transfers`}>Payment receipt</Link>
      </div>
    )
  }

  const pay = async (merchantAddress, amount) => {
    try {
      await paymentProcessorContract.methods.pay(merchantAddress, c.TOKEN_ADDRESS, kit.connection.web3.utils.toWei(amount, 'ether')).send({ from: address }).on('transactionHash', function(hash) {
        // toast.info(() => getTransactionLink(hash));
      });
    } catch(err) {
      console.log(err);
      if (/4001/.test(err)) {
        console.log('Rejected');
      } else {
        !address && await connect();
      }
    }
  };

  const isValidAddress = address => {
    return kit.connection.web3.utils.isAddress(address);
  }

  const getMerchantName = async address => {
    const tokenId = await nftContract.methods.getTokenIdByAddress(address).call();
    const name = (await nftContract.methods.attributes(tokenId).call()).name;

    return name;
  }

  const showName = async address => {
    if (!isValidAddress(address)) {
      return setName('');
    };

    try {
      const name = await getMerchantName(address);
      setName(name);
    } catch(err) {
      console.log(err);
      setName('');
    }
  }

  return (
    <div className={s.formWrap}>
      <ToastContainer
        position="top-center"
      />
      <div className={s.formControl}>
        <label className={s.label}>Merchant ID</label>
        <div className={s.inputWrap}>
          <input ref={merchantIdInput} onBlur={() => showName(merchantIdInput.current.value)} placeholder="0x..." className={s.input} type="text" />
          <div className={s.subLabel}>
            {name}
          </div>
        </div>
      </div>
      <div className={s.formControl}>
        <label className={s.label}>Payment Amount</label>
        <div className={s.inputWrap}>
          <input ref={paymentAmountInput} placeholder="0" className={s.input} type="text" />
          <div className={s.subLabel}>
            $4.79 USD
          </div>
        </div>
      </div>
      <div className={s.formControl}>
        <label className={s.label}>Gas Fee</label>
        <div className={`${s.subLabel} ${s.subLabelLarge}`}>+ {gas} CELO</div>
      </div>
      <button onClick={() => pay(merchantIdInput.current.value, paymentAmountInput.current.value)} className={`${s.btn} ${s.btnLarge}`}>Authorise Transaction</button>
    </div>
  )
}
