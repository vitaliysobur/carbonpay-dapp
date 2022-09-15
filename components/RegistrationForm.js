import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { useCelo } from '@celo/react-celo';
import s from '../styles/App.module.css';
import carbonPayNftAbi from '../abi/CarbonPayNFT.json';

export default ({
  address,
  connect
}) => {
  const { kit } = useCelo();
  const merchantInput = useRef(null);
  const router = useRouter();

  const register = async name => {
    try {
      const contract = new kit.connection.web3.eth.Contract(carbonPayNftAbi, '0x7D70EE9141480F73FB42EF34Fb6Cb925ac244827');
      console.log(await contract.methods.safeMint(address, name).estimateGas());
      await contract.methods.safeMint(address, name).send({ from: address });
      router.push('/merchant');
    } catch(err) {
      console.log(err);
      if (/4001/.test(err)) {
        console.log('Rejected');
      } else {
        !address && await connect();
      }
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