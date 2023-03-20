import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import System from '../../../system'
import { actions as UserActions } from '../auth/sign-out/state-machine'
// import { actions as DataActions } from '../data/state-machine'
import { actions as ViewActions } from './state-machine'
import './styles.css'

function mapStateToProps(state) {
  return {
    view: state.view,
    user: state.auth.user.userRequest.data
    // dataToBeFetched: state.data.polling.dataToBeFetched
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeView(view) {
      dispatch(ViewActions.changeView(view))
    },
    signOut() {
      dispatch(UserActions.signOut())
    }
  }
}

class RootView extends React.Component {
  componentDidMount() {
    $('.navbar-collapse ul li a:not(.dropdown-toggle)').bind(
      'click touchend',
      function () {
        $('.navbar-toggle:visible').click()
      }
    )
  }

  render() {
    const { user, view, changeView } = this.props

    return (
      <div className="root-view">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#main-navigation"
                aria-expanded="false"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link to="/" className="navbar-logo">
                <img src="/logo.png" className="header__logo" />
                <span className="header__title">D&D Session Saver</span>
              </Link>
            </div>
            <div className="collapse navbar-collapse" id="main-navigation">
              {/* <ul className="nav navbar-nav">
                <li>
                  <Link to="/charts" className="nav-link">
                    <i className="fa fa-line-chart" />
                    Charts
                  </Link>
                </li>
                <li>
                  <Link to="/competitions" className="nav-link">
                    <i className="fa fa-trophy" />
                    Competitions
                  </Link>
                </li>
                <li>
                  <Link to="/discover/people" className="nav-link">
                    <i className="fa fa-globe" />
                    Discover
                  </Link>
                </li>
              </ul> */}
              {this.renderAuthLinks()}
            </div>
          </div>
        </nav>
      </div>
    )
  }

  renderAuthLinks() {
    const { user, view, changeView, signOut } =
      this.props
    const activeClass = 'active'
    const inactiveClass = ''

    if (user) {
      return (
        <ul className="nav navbar-nav navbar-right">
          {/* {dataToBeFetched.length > 0 && (
            <li className="sync" onClick={this.props.syncData}>
              <a className="fa fa-refresh"></a>
            </li>
          )}
          {stoppedPolling && (
            <li
              className="view__items__item sync-error"
              onClick={this.props.startPolling}
            >
              <i className="fa fa-refresh" />
            </li>
          )} */}
          <li>
            <Link to="/campaigns" className="nav-link">Campaigns</Link>
          </li>
          <li className="dropdown">
            <a
              href="#"
              className="dropdown-toggle"
              data-toggle="dropdown"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {user.name}
              <i className="caret"></i>
            </a>
            <ul className="dropdown-menu">
              <li>
                <Link to="/profile/details">Profile</Link>
              </li>
              <li>
                <Link to="/profile/videos">Videos</Link>
              </li>
              <li>
                <Link to="/profile/settings">Settings</Link>
              </li>
              <li role="separator" className="divider"></li>
              <li className="sign-out" onClick={signOut}>
                <a>
                  Sign Out <i className="fa fa-sign-out" />
                </a>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/help" className="">
              <i className="fa fa-question" />
            </Link>
          </li>
          {user.type === 'ADMIN' && (
            <li className="dropdown">
              <a
                href="#"
                className="dropdown-toggle"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Admin
                <i className="caret"></i>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/admin/feature">Features</Link>
                </li>
                <li>
                  <Link to="/admin/users">Users</Link>
                </li>
                <li>
                  <Link to="/admin/competition">Competitions</Link>
                </li>
              </ul>
            </li>
          )}
        </ul>
      )
    }

    return (
      <ul className="nav navbar-nav navbar-right">
        <li>
          <Link to="/signIn" className="nav-link">
            Sign In
          </Link>
        </li>
        <li>
          <Link to="/signUp" className="nav-link">
            Sign Up
          </Link>
        </li>
      </ul>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RootView)
