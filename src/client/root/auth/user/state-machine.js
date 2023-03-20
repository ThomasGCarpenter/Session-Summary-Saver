import Request from '../../../services/request'
import ErrorManager from '../../../services/error-manager'

const STATE_PREFIX = 'AUTH_REQUIRE_AUTHENTICATION_'

const FETCH_USER_REQUEST_START = `${STATE_PREFIX}_FETCH_USER_REQUEST_START`
const FETCH_USER_REQUEST_END = `${STATE_PREFIX}_FETCH_USER_REQUEST_END`

const INITIAL_STATE = {
  userRequest: {
    loading: false,
    data: null,
    error: null
  }
}

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_USER_REQUEST_START:
      return {
        ...state,
        userRequest: {
          ...state.userRequest,
          loading: true
        }
      }
    case FETCH_USER_REQUEST_END:
      return {
        ...state,
        userRequest: {
          loading: false,
          data: action.data,
          error: action.error
        }
      }
    default:
      return state
  }
}

function fetchUser() {
  return async function fetchUserThunk(dispatch) {
    dispatch({ type: FETCH_USER_REQUEST_START })

    try {
      const userData = await Request({ url: '/auth/user' })

      dispatch({
        type: FETCH_USER_REQUEST_END,
        data: userData.data,
        error: null
      })
    } catch (error) {
      ErrorManager.handleError(error)
      const errorMessage = ErrorManager.determineErrorMessage({
        error,
        defaultMessage: 'Something went wrong fetching user.'
      })

      dispatch({
        type: FETCH_USER_REQUEST_END,
        data: null,
        error: errorMessage
      })
    }
  }
}

export const actions = {
  fetchUser
}
