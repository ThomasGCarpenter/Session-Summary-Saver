import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { actions as SignUpActions } from './state-machine'
import './styles.css'

function mapStateToProps(state) {
  return {
    signUpForm: state.auth.signUp.form,
    requestAttempted: state.auth.signUp.signUpRequest.attempted,
    errorMessage: state.auth.signUp.signUpRequest.errorMessage
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleUserNameChange(evt) {
      const value = evt.target.value
      dispatch(SignUpActions.updateUserName(value))
    },
    handlePasswordChange(evt) {
      const value = evt.target.value
      dispatch(SignUpActions.updatePassword(value))
    },
    handleConfirmPasswordChange(evt) {
      const value = evt.target.value
      dispatch(SignUpActions.updateConfirmPassword(value))
    },
    handleFormSubmit(evt) {
      evt.preventDefault()
      dispatch(SignUpActions.signUp(ownProps.history))
    },
    resetSignUpRequest() {
      dispatch(SignUpActions.resetSignUp())
    },
    resetForm() {
      dispatch(SignUpActions.resetForm())
    }
  }
}

class SignUp extends React.Component {
  static propTypes = {
    signUpForm: PropTypes.object.isRequired,
    requestAttempted: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    handleFormSubmit: PropTypes.func.isRequired,
    resetSignUpRequest: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired
  }

  componentWillUnmount() {
    this.props.resetForm()
  }

  render() {
    const {
      requestAttempted,
      signUpForm,
      handleUserNameChange,
      handlePasswordChange,
      handleConfirmPasswordChange,
      handleFormSubmit
    } = this.props
    const userNameErrorClass =
      requestAttempted && signUpForm.userName.isValid == false ? 'error' : ''
    const passwordErrorClass =
      requestAttempted && signUpForm.password.isValid === false ? 'error' : ''
    const confirmPasswordErrorClass =
      requestAttempted && signUpForm.confirmPassword.isValid === false
        ? 'error'
        : ''

    return (
      <div className="sign-up">
        <div className="container">
          <form onSubmit={handleFormSubmit}>
            <h2>Sign Up</h2>
            <fieldset className="form-group">
              <label>User Name</label>
              <input
                className={`form-control ${userNameErrorClass}`}
                value={signUpForm.userName.value}
                onChange={handleUserNameChange}
                autoComplete=""
              />
            </fieldset>
            <fieldset className="form-group">
              <label>Password</label>
              <input
                className={`form-control ${passwordErrorClass}`}
                type="password"
                value={signUpForm.password.value}
                onChange={handlePasswordChange}
                autoComplete=""
              />
            </fieldset>
            <fieldset className="form-group">
              <label>Confirm Password</label>
              <input
                className={`form-control ${confirmPasswordErrorClass}`}
                type="password"
                value={signUpForm.confirmPassword.value}
                onChange={handleConfirmPasswordChange}
                autoComplete=""
              />
            </fieldset>
            {this.renderError()}
            <button
              action="submit"
              className="btn btn-primary btn-block sign-up-button"
            >
              Sign Up
            </button>
            <div className="sign-in-section">
              Already have an account? <Link to="/signIn">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    )
  }

  renderError() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <button
            type="button"
            className="close"
            onClick={this.props.resetSignUpRequest}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          {this.props.errorMessage}
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
