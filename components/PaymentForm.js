import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useCelo } from '@celo/react-celo';
import s from '../styles/App.module.css';
import carbonPayProcessorAbi from '../abi/CarbonPayProcessor.json';

export default ({
  address,
  connect
}) => {
  const { kit } = useCelo();
  const merchantInput = useRef(null);
  const router = useRouter();
  const [gas, setGas] = useState(0);

  useEffect(() => {
    (async () => {
      const contract = new kit.connection.web3.eth.Contract(carbonPayProcessorAbi, '0xaBE5396aBE4ab331e1B9594D60966b2259210Bf9');
      const gasPrice = await kit.connection.web3.eth.getGasPrice();
      const gasEstimate = await contract.methods.pay(address, '0xE8e180C9136B8A180cE056773041b76E72178752', kit.connection.web3.utils.toWei('10', 'ether')).estimateGas();
      const gas = (gasPrice * gasEstimate) / (10 ** 18);
      setGas(gas);
    })()
  }, [address]);

  const pay = async name => {
    try {
      const contract = new kit.connection.web3.eth.Contract(carbonPayProcessorAbi, '0xaBE5396aBE4ab331e1B9594D60966b2259210Bf9');
      await contract.methods.pay(address, '0xE8e180C9136B8A180cE056773041b76E72178752', kit.connection.web3.utils.toWei('10', 'ether')).send({ from: address });
    } catch(err) {
      console.log(err);
      if (/4001/.test(err)) {
        console.log('Rejected');
      } else {
        debugger;
        !address && await connect();
      }
    }
  }

  return (
    <div className={s.formWrap}>
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
        <div className={`${s.subLabel} ${s.subLabelLarge}`}>+ {gas} CELO</div>
      </div>
      <button onClick={pay} className={`${s.btn} ${s.btnLarge}`}>Authorise Transaction</button>
    </div>
  )
}
