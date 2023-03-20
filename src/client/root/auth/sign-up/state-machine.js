import System from '../../../../system'
import Request from '../../../services/request'
import { actions as ViewActions } from '../../view/state-machine'
import { actions as UserActions } from '../user/state-machine'

const STATE_PREFIX = 'AUTH_SIGN_UP_'

const SIGN_UP_REQUEST_START = `${STATE_PREFIX}_SIGN_UP_REQUEST_START`
const SIGN_UP_REQUEST_END = `${STATE_PREFIX}_SIGN_UP_REQUEST_END`
const SIGN_UP_REQUEST_RESET = `${STATE_PREFIX}_SIGN_UP_REQUEST_RESET`

const USER_NAME_UPDATE = `${STATE_PREFIX}_USER_NAME_UPDATE`
const PASSWORD_UPDATE = `${STATE_PREFIX}_PASSWORD_UPDATE`
const CONFIRM_PASSWORD_UPDATE = `${STATE_PREFIX}_CONFIRM_PASSWORD_UPDATE`
const FORM_RESET = `${STATE_PREFIX}_FORM_RESET`

const INITIAL_STATE = {
  signUpRequest: {
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
    },
    confirmPassword: {
      value: '',
      isValid: false
    }
  }
}

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SIGN_UP_REQUEST_START:
      return {
        ...state,
        signUpRequest: {
          loading: true,
          attempted: true,
          errorMessage: ''
        }
      }
    case SIGN_UP_REQUEST_END:
      return {
        ...state,
        signUpRequest: {
          ...state.signUpRequest,
          loading: false,
          errorMessage: action.errorMessage
        }
      }
    case SIGN_UP_REQUEST_RESET:
      return {
        ...state,
        signUpRequest: {
          ...state.signUpRequest,
          loading: false,
          errorMessage: ''
        }
      }
    case USER_NAME_UPDATE:
      return {
        ...state,
        form: {
          ...state.form,
          userName: action.payload
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
    case CONFIRM_PASSWORD_UPDATE:
      return {
        ...state,
        form: {
          ...state.form,
          confirmPassword: action.payload
        }
      }
    case FORM_RESET:
      return {
        ...state,
        form: { ...INITIAL_STATE.form }
      }
    default:
      return state
  }
}

function updateUserName(value) {
  let isValid = false

  if (System.Utilities.isNonEmptyString(value)) {
    isValid = true
  }

  return {
    type: USER_NAME_UPDATE,
    payload: { value, isValid }
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

function updateConfirmPassword(value) {
  let isValid = false

  if (System.Utilities.isNonEmptyString(value)) {
    isValid = true
  }

  return {
    type: CONFIRM_PASSWORD_UPDATE,
    payload: { value, isValid }
  }
}

function resetForm() {
  return { type: FORM_RESET }
}

function signUp(history) {
  return async function signUpRequestThunk(dispatch, getState) {
    try {
      dispatch({ type: SIGN_UP_REQUEST_START })

      // Validate and Serialize
      const signUpForm = getState().auth.signUp.form
      const { userName, password, confirmPassword } = signUpForm

      if (userName.isValid === false) {
        dispatch({
          type: SIGN_UP_REQUEST_END,
          errorMessage: 'Please enter a User Name.'
        })
        return
      }

      if (password.isValid === false) {
        dispatch({
          type: SIGN_UP_REQUEST_END,
          errorMessage: 'Please enter a password.'
        })
        return
      }
      if (password.value !== confirmPassword.value) {
        dispatch({
          type: SIGN_UP_REQUEST_END,
          errorMessage: 'Passwords do not match.'
        })
        return
      }

      const body = {
        userName: userName.value.trim(),
        password: password.value.trim()
      }

      await Request({ url: '/auth/signUp', body })

      dispatch({
        type: SIGN_UP_REQUEST_END,
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
        type: SIGN_UP_REQUEST_END,
        errorMessage
      })
    }
  }
}

function resetSignUp() {
  return { type: SIGN_UP_REQUEST_RESET }
}

export const actions = {
  updateUserName,
  updatePassword,
  updateConfirmPassword,
  resetForm,
  signUp,
  resetSignUp
}
