import { combineReducers } from 'redux'
import StoreService from '../services/store'

import { reducer as authReducer } from './auth/state-machine'
// import { reducer as dataReducer } from './data/state-machine';
// import { reducer as filmReducer } from './film/state-machine';
import { reducer as viewReducer } from './view/state-machine'

const rootReducer = combineReducers({
  auth: authReducer,
  // data: dataReducer,
  // film: filmReducer,
  view: viewReducer
})

const resetReducer = (state, action) => {
  if (action.type === 'RESET_STORE') {
    state = undefined
  }

  // Reducers return initial state when called with undefined as 'state' argument
  return rootReducer(state, action)
}

export function resetStore() {
  return { type: 'RESET_STORE' }
}

export const store = StoreService.initializeStore(resetReducer)
