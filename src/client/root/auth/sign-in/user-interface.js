import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { actions as SignInActions } from './state-machine'
import './styles.css'

function mapStateToProps(state) {
  return {
    alertMessage: state.auth.signIn.alertMessage,
    signInForm: state.auth.signIn.form,
    requestAttempted: state.auth.signIn.signInRequest.attempted,
    errorMessage: state.auth.signIn.signInRequest.errorMessage
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    updateAlertMessage(message) {
      dispatch(SignInActions.updateAlertMessage(message))
    },
    handleUserNameChange(evt) {
      const value = evt.target.value
      dispatch(SignInActions.updateUserName(value))
    },
    handlePasswordChange(evt) {
      const value = evt.target.value
      dispatch(SignInActions.updatePassword(value))
    },
    handleFormSubmit(evt) {
      evt.preventDefault()
      dispatch(SignInActions.signIn(ownProps.history))
    },
    resetSignInRequest() {
      dispatch(SignInActions.resetSignIn())
    },
    resetForm() {
      dispatch(SignInActions.resetForm())
    }
  }
}

class SignIn extends React.Component {
  static propTypes = {
    signInForm: PropTypes.object.isRequired,
    requestAttempted: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,
    handleUserNameChange: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    handleFormSubmit: PropTypes.func.isRequired,
    resetSignInRequest: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired
  }

  componentWillUnmount() {
    this.props.resetForm()
  }

  render() {
    const {
      requestAttempted,
      signInForm,
      handleUserNameChange,
      handlePasswordChange,
      handleFormSubmit
    } = this.props
    const userNameErrorClass =
      requestAttempted && signInForm.userName.isValid == false ? 'error' : ''
    const passwordErrorClass =
      requestAttempted && signInForm.password.isValid === false ? 'error' : ''

    return (
      <div className="sign-in">
        <div className="container">
          {this.renderAlertMessage()}
          <form onSubmit={handleFormSubmit}>
            <h2>Sign In</h2>
            <fieldset className="form-group">
              <label>UserName</label>
              <input
                className={`form-control ${userNameErrorClass}`}
                value={signInForm.userName.value}
                onChange={handleUserNameChange}
                autoComplete="username"
              />
            </fieldset>
            <fieldset className="form-group">
              <label>Password</label>
              <input
                className={`form-control ${passwordErrorClass}`}
                type="password"
                value={signInForm.password.value}
                onChange={handlePasswordChange}
                autoComplete="current-password"
              />
            </fieldset>
            <div className="clearfix">
              <div className="pull-left">
                <input type="checkbox" />
                <span className="remember-me-text">Remember Me</span>
              </div>
              <div className="pull-right">
                <Link to="/forgotPassword">Forgot your password?</Link>
              </div>
            </div>
            {this.renderError()}
            <button action="submit" className="btn btn-primary btn-block sign-in-button">
              Sign In
            </button>
            <div className="sign-up-section">
              Need an account? <Link to="/signUp">Create one here.</Link>
            </div>
          </form>
        </div>
      </div>
    )
  }

  renderAlertMessage() {
    if (this.props.alertMessage) {
      return (
        <div className="alert alert-warning">
          <button
            type="button"
            className="close"
            onClick={() => this.props.updateAlertMessage(null)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          {this.props.alertMessage}
        </div>
      )
    }
  }

  renderError() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <button
            type="button"
            className="close"
            onClick={this.props.resetSignInRequest}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          {this.props.errorMessage}
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
