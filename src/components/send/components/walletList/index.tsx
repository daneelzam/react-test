import React from 'react';
import {WalletItem} from "../../../../redux/store";

interface WalletListOptions {
  selectedWallet: WalletItem | undefined;
  walletList: WalletItem[] | undefined;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>, list: WalletItem[] | undefined,)=> void;
  title: string;
}

function WalletList({selectedWallet, walletList, title, handleSelectChange}: WalletListOptions) {
  return (
    <label className='item' htmlFor={`wallet${title}`}>
      {title}
      <select
        value={selectedWallet?.id || ''}
        className="itemSelect"
        id={`wallet${title}`}
        onChange={(event) => handleSelectChange(event, walletList)}
      >
        {walletList?.map((wallet) => (
          <option value={wallet.id} key={`${wallet.id}`}>
            {wallet.title} {wallet.balance}{wallet.currency.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}

export default WalletList;
