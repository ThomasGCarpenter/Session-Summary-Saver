import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

import { actions as RootViewActions } from '../view/state-machine';
import './styles.css';

function mapDispatchToProps(dispatch) {
  return {
    changeRootView(view) {
      dispatch(RootViewActions.changeView(view));
    }
  };
}

class Welcome extends React.Component {
  render() {
    if (this.props.errorMessage) {
      return (
        <div className="welcome">
          <div className="container">
            <div className="error">
              {this.props.errorMessage}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="welcome">
        {!this.props.authUser && (
          <div className="hero">
            <div className="container">
              <div className="col-md-7">
                <div className="hero__pitch">
                  <h1>Discover the best new rap and hip-hop indie artists</h1>
                  <div className="hero-buttons">
                    <Link
                      to={`/discover/people`}
                      className="btn btn-primary"
                    >
                      See Trending Artists
                    </Link>
                    <Link
                      to={`/competitions`}
                      className="btn btn-secondary"
                    >
                      See Upcoming Competitions
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(Welcome);
