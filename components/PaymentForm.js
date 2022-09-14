import React from 'react';
import s from '../styles/App.module.css'
import '@celo/react-celo/lib/styles.css';

export default () => {
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
        <div className={`${s.subLabel} ${s.subLabelLarge}`}>+0.05 CELO</div>
      </div>
      <button className={`${s.btn} ${s.btnLarge}`}>Authorise Transaction</button>
    </div>
  )
}
