import React, { useRef } from 'react';
import { useCelo } from '@celo/react-celo';
import s from '../styles/App.module.css';
import carbonPayNftAbi from '../abi/CarbonPayNFT.json';

export default ({
  address,
  connect
}) => {
  const { kit } = useCelo();
  const merchantInput = useRef(null);

  const register = async name => {
    let accounts = await kit.contracts.getAccounts();
    kit.defaultAccount = accounts[0];
    let contract = new kit.connection.web3.eth.Contract(carbonPayNftAbi, address);
    try {
      await contract.methods.safeMint(address, name).estimateGas();
      await contract.methods.safeMint(address, name).send({ from: address });
      router.push('/merchant');
    } catch(err) {
      !address && connect();
      router.push('/merchant');
    }
  }

  return (
    <div className={s.formWrap}>
      <div className={s.formControl}>
        <label className={s.label}>Merchant Name</label>
        <div className={s.inputWrap}>
          <input ref={merchantInput} placeholder="Jen's Bakery" className={s.input} type="text" />
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
      <button onClick={() => register(merchantInput.current.value)} className={`${s.btn} ${s.btnLarge}`}>Mint carbonNFT</button>
    </div>
  );
}