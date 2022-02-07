import { createStore } from 'redux';

export interface WalletItem {
  id: number;
  title: string;
  currency: string;
  balance: number;
}

const MOCK_WALLET_LIST = [{
  id: 1,
  title: 'EUR wallet 1',
  currency: 'eur',
  balance: 10,
}, {
  id: 2,
  title: 'EUR wallet 2',
  currency: 'eur',
  balance: 7,
}, {
  id: 3,
  title: 'USD wallet 2',
  currency: 'usd',
  balance: 4,
}, {
  id: 4,
  title: 'EUR wallet 3',
  currency: 'eur',
  balance: 4,
}]

const initialState: WalletItem[] = MOCK_WALLET_LIST;

// const initialState: WalletItem[] = [];

const SEND_TRANSACTION = 'transaction/send';

export interface SendTransaction {walletFrom: WalletItem, walletTo: WalletItem, amount: number, fee: number};

const sendTransaction = (state: WalletItem[], payload: SendTransaction) => {
  const newState = [...state];
  const { walletFrom, walletTo, amount, fee } = payload;
  const walletFromIndex = newState.indexOf(walletFrom);
  newState[walletFromIndex].balance = Number((newState[walletFromIndex].balance - amount - fee).toFixed(2));
  const walletToIndex = newState.indexOf(walletTo);
  newState[walletToIndex].balance = Number((newState[walletToIndex].balance + amount).toFixed(2));
  return [...newState]
};

export const sendTransactionAC = (payload: SendTransaction) => {
  return {type: SEND_TRANSACTION, payload};
}

export const reducer = (state = initialState, action: {type: string; payload: any}) => {
  switch (action.type) {
    case SEND_TRANSACTION:
      return sendTransaction(state, action.payload);
    default:
      return state;
  }
}

let store = createStore(reducer);

export default store;
