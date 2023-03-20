import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './client/root/state-machine'
import UserInterface from './client/root/user-interface'

ReactDOM.render(
  <Provider store={store}>
    <UserInterface />
  </Provider>,
  document.getElementById('root')
)
