import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {reducer, WalletItem} from "../redux/store";
import NavBar from "./NavBar";

export const MOCK_WALLET_LIST = [{
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
}, {
  id: 5,
  title: 'EUR wallet 4',
  currency: 'eur',
  balance: 8,
}]

export const renderWithReduxAndRouter = (
  component: JSX.Element,
  { initialState,
    store = createStore(reducer, initialState)
  }: {initialState?: WalletItem[]; store?: any } = {}
) => {
  return {
    ...render((
      <MemoryRouter>
        <Provider store={store}>
          {component}
        </Provider>
      </MemoryRouter>)),
    store
  }
}

export const renderWithRouter = (
  component: JSX.Element ) => (
    render((
      <MemoryRouter>
          {component}
      </MemoryRouter>))
)

describe('Routing testing', () => {
  test('First element is Welcome page', () => {
    renderWithReduxAndRouter(<NavBar/>, { initialState: MOCK_WALLET_LIST })
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
  })

  test('After clicking the "Send" link, the "Send" page opens.', () => {
    renderWithReduxAndRouter(<NavBar/>, { initialState: MOCK_WALLET_LIST })
    userEvent.click(screen.getByText('Send'));
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  test('After clicking the "Confirm" button, the "Success" page opens.', () => {
    const { store } = renderWithReduxAndRouter(<NavBar/>, { initialState: MOCK_WALLET_LIST })
    const state = store.getState();
    userEvent.click(screen.getByText('Send'));
    userEvent.selectOptions(screen.getByLabelText<HTMLSelectElement>('From'), state[3].id.toString())
    userEvent.selectOptions(screen.getByLabelText<HTMLSelectElement>('To'), state[4].id.toString())
    userEvent.type(screen.getByLabelText('Amount'), '1');
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('success')).toBeInTheDocument()
  })
})

