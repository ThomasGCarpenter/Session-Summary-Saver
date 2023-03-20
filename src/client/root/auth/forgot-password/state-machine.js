import System from '../../../../system'
import Request from '../../../services/request'
import { actions as ViewActions } from '../../view/state-machine'
import { actions as UserActions } from '../user/state-machine'

const STATE_PREFIX = 'AUTH_FORGOT_PASSWORD_'

const FORGOT_PASSWORD_REQUEST_START = `${STATE_PREFIX}_FORGOT_PASSWORD_REQUEST_START`
const FORGOT_PASSWORD_REQUEST_END = `${STATE_PREFIX}_FORGOT_PASSWORD_REQUEST_END`
const FORGOT_PASSWORD_REQUEST_RESET = `${STATE_PREFIX}_FORGOT_PASSWORD_REQUEST_RESET`

const EMAIL_UPDATE = `${STATE_PREFIX}_EMAIL_UPDATE`

const FORM_RESET = `${STATE_PREFIX}_FORM_RESET`

const INITIAL_STATE = {
  alertMessage: '',
  forgotPasswordRequest: {
    loading: false,
    attempted: false,
    errorMessage: ''
  },
  form: {
    email: {
      value: '',
      isValid: false
    }
  }
}

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FORGOT_PASSWORD_REQUEST_START:
      return {
        ...state,
        forgotPasswordRequest: {
          loading: true,
          attempted: true,
          errorMessage: ''
        }
      }
    case FORGOT_PASSWORD_REQUEST_END:
      return {
        ...state,
        forgotPasswordRequest: {
          ...state.forgotPasswordRequest,
          loading: false,
          errorMessage: action.errorMessage
        }
      }
    case FORGOT_PASSWORD_REQUEST_RESET:
      return {
        ...state,
        forgotPasswordRequest: {
          ...state.forgotPasswordRequest,
          loading: false,
          errorMessage: ''
        }
      }
    case EMAIL_UPDATE:
      return {
        ...state,
        form: {
          ...state.form,
          email: action.payload
        }
      }
    case FORM_RESET:
      return {
        ...state,
        form: {
          email: {
            value: '',
            isValid: false
          }
        }
      }
    default:
      return state
  }
}

function updateEmail(value) {
  let isValid = false

  if (System.Utilities.isValidUserName(value)) {
    isValid = true
  }

  return {
    type: EMAIL_UPDATE,
    payload: { value, isValid }
  }
}

function resetForm() {
  return { type: FORM_RESET }
}

function forgotPassword(history) {
  return async function forgotPasswordRequestThunk(dispatch, getState) {
    try {
      dispatch({ type: FORGOT_PASSWORD_REQUEST_START })

      // Validate and Serialize
      const forgotPasswordForm = getState().auth.forgotPassword.form
      const { email } = forgotPasswordForm

      if (email.isValid === false) {
        dispatch({
          type: FORGOT_PASSWORD_REQUEST_END,
          errorMessage: 'Please enter a valid email.'
        })
        return
      }

      const body = {
        email: email.value
      }

      await Request({ url: '/web/auth/forgotPassword', body })

      dispatch({
        type: FORGOT_PASSWORD_REQUEST_END,
        errorMessage: ''
      })

      //history.push('/signIn')
    } catch (error) {
      let errorMessage
      try {
        errorMessage = error.response.data.message
      } catch (e) {
        errorMessage = 'Something went wrong.'
      }

      dispatch({
        type: FORGOT_PASSWORD_REQUEST_END,
        errorMessage
      })
    }
  }
}

function resetForgotPassword() {
  return { type: FORGOT_PASSWORD_REQUEST_RESET }
}

export const actions = {
  updateEmail,
  resetForm,
  forgotPassword,
  resetForgotPassword
}
