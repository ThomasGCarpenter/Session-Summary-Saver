import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { actions as ResetPasswordActions } from './state-machine'
import './styles.css'

function mapStateToProps(state) {
  return {
    resetPasswordForm: state.auth.resetPassword.form,
    requestAttempted: state.auth.resetPassword.resetPasswordRequest.attempted,
    errorMessage: state.auth.resetPassword.resetPasswordRequest.errorMessage
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handlePasswordChange(evt) {
      const value = evt.target.value
      dispatch(ResetPasswordActions.updatePassword(value))
    },
    handleConfirmedPasswordChange(evt) {
      const value = evt.target.value
      dispatch(ResetPasswordActions.updateConfirmedPassword(value))
    },
    handleFormSubmit(evt) {
      evt.preventDefault()
      dispatch(
        ResetPasswordActions.resetPassword({
          history: ownProps.history,
          userId: ownProps.match.params.userId,
          token: ownProps.match.params.token
        })
      )
    },
    resetResetPasswordRequest() {
      dispatch(ResetPasswordActions.resetResetPassword())
    },
    resetForm() {
      dispatch(ResetPasswordActions.resetForm())
    }
  }
}

class ResetPassword extends React.Component {
  componentWillUnmount() {
    this.props.resetForm()
  }

  render() {
    const {
      requestAttempted,
      resetPasswordForm,
      handlePasswordChange,
      handleConfirmedPasswordChange,
      handleFormSubmit
    } = this.props
    const passwordErrorClass =
      requestAttempted && resetPasswordForm.password.isValid == false
        ? 'error'
        : ''
    const confirmedPasswordErrorClass =
      requestAttempted && resetPasswordForm.confirmedPassword.isValid == false
        ? 'error'
        : ''

    return (
      <div className="reset-password">
        <div className="container">
          {this.renderAlertMessage()}
          <form onSubmit={handleFormSubmit}>
            <h2>Reset Password</h2>
            <fieldset className="form-group">
              <label>New Password</label>
              <input
                type="password"
                className={`form-control ${passwordErrorClass}`}
                value={resetPasswordForm.password.value}
                onChange={handlePasswordChange}
                autoComplete="password"
              />
            </fieldset>
            <fieldset className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                className={`form-control ${confirmedPasswordErrorClass}`}
                value={resetPasswordForm.confirmedPassword.value}
                onChange={handleConfirmedPasswordChange}
                autoComplete="password"
              />
            </fieldset>
            {this.renderError()}
            <button
              action="submit"
              className="btn btn-primary btn-block sign-in-button"
            >
              Reset Password
            </button>
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
            onClick={this.props.resetResetPasswordRequest}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          {this.props.errorMessage}
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
