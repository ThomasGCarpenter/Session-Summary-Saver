import { combineReducers } from 'redux'
import { reducer as forgotPasswordReducer } from './forgot-password/state-machine'
import { reducer as resetPasswordReducer } from './reset-password/state-machine'
import { reducer as signUpReducer } from './sign-up/state-machine'
import { reducer as signInReducer } from './sign-in/state-machine'
import { reducer as signOutReducer } from './sign-out/state-machine'
import { reducer as userReducer } from './user/state-machine'

export const reducer = combineReducers({
  forgotPassword: forgotPasswordReducer,
  resetPassword: resetPasswordReducer,
  signUp: signUpReducer,
  signIn: signInReducer,
  signOut: signOutReducer,
  user: userReducer
})
