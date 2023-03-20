import System from '../../../../system'
import Request from '../../../services/request'
import { actions as ViewActions } from '../../view/state-machine'
import { actions as UserActions } from '../user/state-machine'

const STATE_PREFIX = 'AUTH_RESET_PASSWORD_'

const RESET_PASSWORD_REQUEST_START = `${STATE_PREFIX}_RESET_PASSWORD_REQUEST_START`
const RESET_PASSWORD_REQUEST_END = `${STATE_PREFIX}_RESET_PASSWORD_REQUEST_END`
const RESET_PASSWORD_REQUEST_RESET = `${STATE_PREFIX}_RESET_PASSWORD_REQUEST_RESET`

const PASSWORD_UPDATE = `${STATE_PREFIX}_PASSWORD_UPDATE`
const CONFIRMED_PASSWORD_UPDATE = `${STATE_PREFIX}_CONFIRMED_PASSWORD_UPDATE`

const FORM_RESET = `${STATE_PREFIX}_FORM_RESET`

const INITIAL_STATE = {
  alertMessage: '',
  resetPasswordRequest: {
    loading: false,
    attempted: false,
    errorMessage: ''
  },
  form: {
    password: {
      value: '',
      isValid: false
    },
    confirmedPassword: {
      value: '',
      isValid: false
    }
  }
}

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case RESET_PASSWORD_REQUEST_START:
      return {
        ...state,
        resetPasswordRequest: {
          loading: true,
          attempted: true,
          errorMessage: ''
        }
      }
    case RESET_PASSWORD_REQUEST_END:
      return {
        ...state,
        resetPasswordRequest: {
          ...state.resetPasswordRequest,
          loading: false,
          errorMessage: action.errorMessage
        }
      }
    case RESET_PASSWORD_REQUEST_RESET:
      return {
        ...state,
        resetPasswordRequest: {
          ...state.resetPasswordRequest,
          loading: false,
          errorMessage: ''
        }
      }
    case PASSWORD_UPDATE:
      return {
        ...state,
        form: {
          ...state.form,
          password: action.payload
        }
      }
    case CONFIRMED_PASSWORD_UPDATE:
      return {
        ...state,
        form: {
          ...state.form,
          confirmedPassword: action.payload
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

function updatePassword(value) {
  let isValid = false

  if (System.Utilities.isNonEmptyString(value)) {
    isValid = true
  }

  return {
    type: PASSWORD_UPDATE,
    payload: { value, isValid }
  }
}

function updateConfirmedPassword(value) {
  let isValid = false

  if (System.Utilities.isNonEmptyString(value)) {
    isValid = true
  }

  return {
    type: CONFIRMED_PASSWORD_UPDATE,
    payload: { value, isValid }
  }
}

function resetForm() {
  return { type: FORM_RESET }
}

function resetPassword({ history, userId, token }) {
  return async function resetPasswordRequestThunk(dispatch, getState) {
    try {
      dispatch({ type: RESET_PASSWORD_REQUEST_START })

      // Validate and Serialize
      const resetPasswordForm = getState().auth.resetPassword.form
      const { password, confirmedPassword } = resetPasswordForm

      if (password.isValid === false) {
        dispatch({
          type: RESET_PASSWORD_REQUEST_END,
          errorMessage: 'Please enter a new password.'
        })
        return
      }
      if (password.value !== confirmedPassword.value) {
        dispatch({
          type: RESET_PASSWORD_REQUEST_END,
          errorMessage: 'Passwords do not match.'
        })
        return
      }

      const body = {
        userId,
        token,
        password: password.value,
        confirmedPassword: confirmedPassword.value
      }

      await Request({ url: '/web/auth/resetPassword', body })

      dispatch({
        type: RESET_PASSWORD_REQUEST_END,
        errorMessage: ''
      })

      history.push('/signIn')
    } catch (error) {
      let errorMessage
      try {
        errorMessage = error.response.data.message
      } catch (e) {
        errorMessage = 'Something went wrong.'
      }

      dispatch({
        type: RESET_PASSWORD_REQUEST_END,
        errorMessage
      })
    }
  }
}

function resetResetPassword() {
  return { type: RESET_PASSWORD_REQUEST_RESET }
}

export const actions = {
  updatePassword,
  updateConfirmedPassword,
  resetForm,
  resetPassword,
  resetResetPassword
}
