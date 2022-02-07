import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { SendTransaction, sendTransactionAC, WalletItem } from "../../redux/store";
import WalletList from "./components/walletList";
import {NavigateFunction, useNavigate} from "react-router-dom";

interface Error { status: boolean; message?: string; }

interface HandleConfirm {
  event: React.MouseEvent<HTMLButtonElement>;
  walletFrom?: WalletItem;
  walletTo?: WalletItem;
  amount: number | undefined;
  fee: number;
  setError: React.Dispatch<React.SetStateAction<Error>>,
  sendTransaction: (payload: SendTransaction) => void
  navigate: NavigateFunction;
}

const handleInputChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setValue: React.Dispatch<React.SetStateAction<number>>
) => {
  return setValue(Number(event.target.value));
};

const handleConfirm = (
  { event, walletFrom, walletTo, amount, fee, setError, sendTransaction, navigate } : HandleConfirm
) => {
  event.preventDefault();
  if (!walletFrom || !walletTo) {
    return setError({status: true, message: 'Error: choose wallet please'})
  }
  if (!amount) {
    return setError({status: true, message: 'Error: amount must be greater than zero'})
  }
  if ((amount + fee) > walletFrom.balance) {
    return setError({status: true, message: 'Error: insufficient founds'})
  }
  sendTransaction({walletTo, walletFrom, amount, fee})
  navigate('/success');
}

const getFee = ( amount: number ) => amount * 0.01;

const getUser = () => Promise.resolve({ id: '1', name: 'John Doe' })

const handleSelectChange = (
  event: React.ChangeEvent<HTMLSelectElement>,
  walletList: WalletItem[] | undefined,
  setWallet: React.Dispatch<React.SetStateAction<WalletItem | undefined>>,
) => {
  if (walletList && walletList.length) {
    const value = Number(event.target.value);
    const foundWallet = walletList.find((wallet) => wallet.id === value);
    if (foundWallet) {
      return setWallet(foundWallet)}
  }
  return setWallet(undefined)
};

function Send() {
  const walletList = useSelector((state)=> state as WalletItem[]);
  const dispatch = useDispatch();
  const sendTransaction = (payload: SendTransaction) => dispatch(sendTransactionAC(payload));
  const navigate = useNavigate();
  const [filteredWalletList, setFilteredWalletList] = useState(walletList);
  const [walletFrom, setWalletFrom] = useState<WalletItem | undefined>(walletList[0] || undefined);
  const [walletTo, setWalletTo] = useState<WalletItem | undefined>(undefined);
  const [amount, setAmount] = useState<number>(0);
  const [fee, setFee] = useState<number>(0);
  const [error, setError] = useState<Error>({status: false});
  const [user, setUser] = useState<{id: string; name: string} | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      setUser(user);
    };
    loadUser();
  }, []);

  useEffect(()=>{
    if (walletFrom){
      const toWallets = walletList.filter((item) => (
        (item.currency === walletFrom.currency) && (item.id !== walletFrom.id)
      ));
      setFilteredWalletList(toWallets)
      if (toWallets.length){
        setWalletTo(toWallets[0])
      } else {
        setWalletTo(undefined)
      }
    }
  },[walletFrom, walletList])

  useEffect(() => {
    const actualFee = getFee(amount);
    setFee(actualFee)
  }, [amount])

  useEffect(()=>{
    if (error.status) {
      setTimeout(()=> setError({status: false}), 2000)
    }
  }, [error.status])

  return (
    <div className="wrapper">
      {user && <div>Hello {user.name}</div>}
      <form>
        <WalletList title='From' selectedWallet={walletFrom} walletList={walletList}
                    handleSelectChange={(e: React.ChangeEvent<HTMLSelectElement>,
                                         list: WalletItem[] | undefined) => handleSelectChange(e, list, setWalletFrom)}
        />
        {walletFrom && <span className='item'>Available balance: {walletFrom.balance}</span>}
        <WalletList title='To' selectedWallet={walletTo} walletList={filteredWalletList}
                    handleSelectChange={(e: React.ChangeEvent<HTMLSelectElement>,
                                         list: WalletItem[] | undefined) => handleSelectChange(e, list, setWalletTo)}
        />
        <label className='item' htmlFor="amount">
          Amount
          <input className="itemSelect" id="amount" type="number" value={amount}
            onChange={(event)=>handleInputChange(event, setAmount)}
          />
        </label>
        <label className='item' htmlFor="fee">
          Fee
          <input className="itemSelect" id="fee" type="number" value={fee} disabled
          />
        </label>
        <button className="button"
          onClick={(event)=>handleConfirm({
            event, walletFrom, walletTo, amount, fee, setError, sendTransaction, navigate
          })}
        >Confirm</button>
      </form>
      {error.status && (
        <div className="error">
          {error.message}
        </div>
      )}
    </div>
  );
}

export default Send;
