import System from '../../../../system'
import Request from '../../../services/request'
import { actions as ViewActions } from '../../view/state-machine'
import { actions as UserActions } from '../user/state-machine'

const STATE_PREFIX = 'AUTH_SIGN_IN_'

const SIGN_IN_REQUEST_START = `${STATE_PREFIX}_SIGN_IN_REQUEST_START`
const SIGN_IN_REQUEST_END = `${STATE_PREFIX}_SIGN_IN_REQUEST_END`
const SIGN_IN_REQUEST_RESET = `${STATE_PREFIX}_SIGN_IN_REQUEST_RESET`

const ALERT_MESSAGE_UPDATE = `${STATE_PREFIX}_ALERT_MESSAGE_UPDATE`

const FORM_USERNAME_UPDATE = `${STATE_PREFIX}_FORM_USERNAME_UPDATE`
const FORM_PASSWORD_UPDATE = `${STATE_PREFIX}_FORM_PASSWORD_UPDATE`
const FORM_RESET = `${STATE_PREFIX}_FORM_RESET`

const INITIAL_STATE = {
  alertMessage: '',
  signInRequest: {
    loading: false,
    attempted: false,
    errorMessage: ''
  },
  form: {
    userName: {
      value: '',
      isValid: false
    },
    password: {
      value: '',
      isValid: false
    }
  }
}

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SIGN_IN_REQUEST_START:
      return {
        ...state,
        signInRequest: {
          loading: true,
          attempted: true,
          errorMessage: ''
        }
      }
    case SIGN_IN_REQUEST_END:
      return {
        ...state,
        signInRequest: {
          ...state.signInRequest,
          loading: false,
          errorMessage: action.errorMessage
        }
      }
    case SIGN_IN_REQUEST_RESET:
      return {
        ...state,
        signInRequest: {
          ...state.signInRequest,
          loading: false,
          errorMessage: ''
        }
      }
    case ALERT_MESSAGE_UPDATE:
      return {
        ...state,
        alertMessage: action.payload
      }
    case FORM_USERNAME_UPDATE:
      return {
        ...state,
        form: {
          ...state.form,
          userName: action.payload
        }
      }
    case FORM_PASSWORD_UPDATE:
      return {
        ...state,
        form: {
          ...state.form,
          password: action.payload
        }
      }
    case FORM_RESET:
      return {
        ...state,
        form: {
          userName: {
            value: '',
            isValid: false
          },
          password: {
            value: '',
            isValid: false
          }
        }
      }
    default:
      return state
  }
}

function updateAlertMessage(message) {
  return {
    type: ALERT_MESSAGE_UPDATE,
    payload: message
  }
}

function updateUserName(value) {
  let isValid = false

  if (System.Utilities.isValidUserName(value)) {
    isValid = true
  }

  return {
    type: FORM_USERNAME_UPDATE,
    payload: { value, isValid }
  }
}

function updatePassword(value) {
  let isValid = false

  if (System.Utilities.isNonEmptyString(value)) {
    isValid = true
  }

  return {
    type: FORM_PASSWORD_UPDATE,
    payload: { value, isValid }
  }
}

function resetForm() {
  return { type: FORM_RESET }
}

function signIn(history) {
  return async function signInRequestThunk(dispatch, getState) {
    try {
      dispatch({ type: SIGN_IN_REQUEST_START })

      // Validate and Serialize
      const signInForm = getState().auth.signIn.form
      const { userName, password } = signInForm

      if (userName.isValid === false) {
        dispatch({
          type: SIGN_IN_REQUEST_END,
          errorMessage: 'Please enter a valid UserName.'
        })
        return
      }
      if (password.isValid === false) {
        dispatch({
          type: SIGN_IN_REQUEST_END,
          errorMessage: 'Please enter a password.'
        })
        return
      }

      const body = {
        userName: userName.value,
        password: password.value
      }

      await Request({ url: '/auth/signIn', body })

      dispatch({
        type: SIGN_IN_REQUEST_END,
        errorMessage: ''
      })
      dispatch(UserActions.fetchUser())

      history.push('/')
    } catch (error) {
      let errorMessage
      try {
        errorMessage = error.response.data.message
      } catch (e) {
        errorMessage = 'Something went wrong.'
      }

      dispatch({
        type: SIGN_IN_REQUEST_END,
        errorMessage
      })
    }
  }
}

function resetSignIn() {
  return { type: SIGN_IN_REQUEST_RESET }
}

export const actions = {
  updateAlertMessage,
  updateUserName,
  updatePassword,
  resetForm,
  signIn,
  resetSignIn
}
