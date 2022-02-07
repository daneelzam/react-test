import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import Send from './index';
import { MOCK_WALLET_LIST, renderWithReduxAndRouter } from "../NavBar.test";

describe('Send component testing', () => {

  test('User element: null after first render',function () {
    renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    expect(screen.queryByText(/Hello/)).toBeNull();
  });

  test('User element: exist after fetch data', async function () {
    renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    expect(await screen.findByText(/Hello/)).toBeInTheDocument()
  });

  test('From element: default value is the first wallet', function () {
    const { store } = renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    const state = store.getState();
    expect(screen.getByLabelText<HTMLSelectElement>('From').value).toBe(state[0].id.toString());
  });

  test('To element: default value is a second wallet',function () {
    const { store } = renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    const state = store.getState();
    expect(screen.getByLabelText<HTMLSelectElement>('To').value).toBe(state[1].id.toString());
  });

  test('From element: change wallet',  function () {
    const { store } = renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    const state = store.getState();
    userEvent.selectOptions(screen.getByLabelText<HTMLSelectElement>('From'), state[1].id.toString())
    expect(screen.getByLabelText<HTMLSelectElement>('From').value).toBe(state[1].id.toString());
  });

  test('To element: change wallet', function () {
    const { store } = renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    const state = store.getState();
    userEvent.selectOptions(screen.getByLabelText<HTMLSelectElement>('To'), state[3].id.toString())
    expect(screen.getByLabelText<HTMLSelectElement>('To').value).toBe(state[3].id.toString());
  });

  test('To element: value is "" if there is no wallet in the same currency',
    function () {
      const { store } = renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
      const state = store.getState();
      userEvent.selectOptions(screen.getByLabelText<HTMLSelectElement>('From'), state[2].id.toString())
      expect(screen.getByLabelText<HTMLSelectElement>('From').value).toBe(state[2].id.toString());
      expect(screen.getByLabelText<HTMLSelectElement>('To').value).toBe('');
  });

  test('Amount element: default value is 0', () => {
    renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    expect(screen.getByLabelText<HTMLInputElement>('Amount').value).toBe('0');
  })

  test('Amount element: change amount value', () => {
    renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    userEvent.type(screen.getByLabelText<HTMLInputElement>('Amount'), '10')
    expect(screen.getByLabelText<HTMLInputElement>('Amount').value).toBe('10');
  })

  test('Amount element: if user types not a number value amount will be 0',  () => {
    renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    userEvent.type(screen.getByLabelText<HTMLInputElement>('Amount'), 'f')
    expect(screen.getByLabelText<HTMLInputElement>('Amount').value).toBe('0');
  })

  test('Fee element: default value is 0', () => {
    renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    expect(screen.getByLabelText<HTMLInputElement>('Fee').value).toBe('0');
  })

  test('Fee element: element is disabled', () => {
    renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    expect(screen.getByLabelText<HTMLInputElement>('Fee').disabled).toBeTruthy();
  })

  test('Fee element: value was changed after change of amount value',  () => {
    renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    userEvent.type(screen.getByLabelText<HTMLInputElement>('Amount'), '10')
    expect(screen.getByLabelText<HTMLInputElement>('Fee').value).toBe('0.1');
  })

  test('Balance element: default value is balance of the first wallet',  () => {
    const { store } = renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    const state = store.getState();
    expect(screen.getByText<HTMLSpanElement>(/balance/i)).toHaveTextContent(state[0].balance.toString());
  })

  test('Balance element: value was changed after change of wallet in the field "From"', () => {
    const { store } = renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    const state = store.getState();
    userEvent.selectOptions(screen.getByLabelText<HTMLSelectElement>('From'), state[1].id.toString())
    expect(screen.getByText<HTMLSpanElement>(/balance/i)).toHaveTextContent(state[1].balance.toString());
  })

  test('SendTransaction: balances were changed after sending funds',  () => {
    const { store } = renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    const state = store.getState();
    userEvent.type(screen.getByLabelText<HTMLInputElement>('Amount'), '5')
    userEvent.click(screen.getByRole('button'));
    expect(state[0].balance).toBe(4.95);
    expect(state[1].balance).toBe(12);
  })

  test('Error element: not to be in the component by default',  () => {
    renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    expect(screen.queryByText('Error')).not.toBeInTheDocument();

  })

  test('Error element: "choose wallet please" error - in the field "From"',  () => {
    renderWithReduxAndRouter(<Send />, { initialState: []})
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/choose wallet please/i)).toBeInTheDocument();
  })

  test('Error element: "choose wallet please" error - in the field "To"',  () => {
    const { store } = renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    const state = store.getState();
    userEvent.selectOptions(screen.getByLabelText<HTMLSelectElement>('From'), '3');
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/choose wallet please/i)).toBeInTheDocument();
    expect(screen.getByText<HTMLSpanElement>(/balance/i)).toHaveTextContent(state[2].balance.toString())
  })

  test('Error element: "amount must be greater than zero"',  () => {
    const { store } = renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    const state = store.getState();
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/amount must be greater than zero/i)).toBeInTheDocument();
    expect(screen.getByText<HTMLSpanElement>(/balance/i)).toHaveTextContent(state[0].balance.toString())
  })

  test('Error element: "insufficient funds"', () => {
    const { store } = renderWithReduxAndRouter(<Send />, { initialState: MOCK_WALLET_LIST})
    const state = store.getState();
    userEvent.type(screen.getByLabelText<HTMLInputElement>('Amount'), '10')
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/insufficient founds/i)).toBeInTheDocument();
    expect(screen.getByText<HTMLSpanElement>(/balance/i)).toHaveTextContent(state[0].balance.toString())
  })
})
