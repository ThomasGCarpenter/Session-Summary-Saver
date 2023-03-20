import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import './shared/view/styles.css'
import './shared/module/styles.css'

// import { actions as DataActions } from './data/state-machine';
import { actions as UserActions } from './auth/user/state-machine'
import './styles.css'
import RequireAuth from './auth/require-auth/user-interface'
import SignIn from './auth/sign-in/user-interface'
import View from './view/user-interface'
import Home from './home/user-interface'
// import Film from './film/user-interface';
import Settings from './settings/user-interface'
import Welcome from './welcome/user-interface'
import NotFound from './not-found'
import Header from './view/user-interface'
import SignUp from './auth/sign-up/user-interface'
import Campaign from './campaigns/user-interface'
import Campaigns from './campaigns/user-interface'

// const AuthenticatedFilm = RequireAuth(Film)
const AuthenticatedSettings = RequireAuth(Settings)
const AuthenticatedCampaigns = RequireAuth(Campaign)

function mapStateToProps(state) {
  return {
    view: state.view,
    data: state.data,
    userRequest: state.auth.user.userRequest
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUser() {
      dispatch(UserActions.fetchUser())
    }
    // fetchFilms() {
    //   dispatch(DataActions.fetchFilms());
    // }
  }
}

class UserInterface extends React.Component {
  static propTypes = {
    view: PropTypes.string.isRequired
  }

  state = { error: null }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)

    this.setState({ error })
  }

  componentDidMount() {
    this.props.fetchUser()
  }

  // Implement with User authentication
  componentDidUpdate() {
    const {
      userRequest
      //   data: { filmsRequest }
    } = this.props

    // if (userRequest.data) {
    //   if (
    //     filmsRequest.loading === false &&
    //     filmsRequest.data === null &&
    //     filmsRequest.errorMessage === ''
    //   ) {
    //     this.props.fetchFilms();
    //   }
    // }
  }

  render() {
    if (this.state.error) {
      // Fall Back UI
      return (
        <div className="user-interface">
          <div className="user-interface-error">
            <div className="error-title">Error</div>
            Oh No! Something went wrong. Please refresh and try again. If this
            problem persists, please contact support.
          </div>
        </div>
      )
    }

    return (
      <Router>
        <div className="user-interface">
          <Header />
          <Switch>
            <Route
              path="/signUp"
              render={(props) => {
                return <SignUp {...props} />
              }}
            />
               <Route
              path="/signIn"
              render={(props) => {
                return <SignIn {...props} />
              }}
            />
            <Route path="/campaigns" render={(props) => {
              return <AuthenticatedCampaigns {...props} />
            }} />
            <Route path="/">
              <Welcome />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInterface)
