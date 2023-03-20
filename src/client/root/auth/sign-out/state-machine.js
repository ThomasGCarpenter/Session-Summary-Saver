import Request from '../../../services/request'
import { resetStore } from '../../state-machine'

const STATE_PREFIX = 'AUTH_SIGN_OUT_'

const SIGN_OUT_REQUEST_START = `${STATE_PREFIX}_SIGN_OUT_REQUEST_START`
const SIGN_OUT_REQUEST_END = `${STATE_PREFIX}_SIGN_OUT_REQUEST_END`

const INITIAL_STATE = {
  signOutRequest: {
    loading: false,
    error: null
  }
}

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SIGN_OUT_REQUEST_START:
      return {
        ...state,
        signOutRequest: {
          loading: true,
          error: null
        }
      }
    case SIGN_OUT_REQUEST_END:
      return {
        ...state,
        signOutRequest: {
          loading: false,
          error: action.error
        }
      }
    default:
      return state
  }
}

function signOut() {
  return async function signOutThunk(dispatch) {
    try {
      dispatch({ type: SIGN_OUT_REQUEST_START })

      await Request({ url: '/auth/signOut' })
      dispatch({
        type: SIGN_OUT_REQUEST_END,
        error: null
      })
      dispatch(resetStore())
    } catch(error) {
      let errorMessage
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      } else {
        errorMessage = 'Something went wrong.'
      }

      dispatch({
        type: SIGN_OUT_REQUEST_END,
        error: errorMessage
      })
    }
  }
}

export const actions = {
  signOut
}
