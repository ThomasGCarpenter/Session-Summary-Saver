import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

function mapStateToProps(state) {
  return {
    userRequest: state.auth.user.userRequest
  };
}

class Settings extends React.Component {
  render() {
    return (
      <div className="settings">
        <div className="container">{this.renderWhenReady()}</div>
      </div>
    );
  }

  renderWhenReady() {
    const { loading, errorMessage, data } = this.props.userRequest;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (errorMessage) {
      return <div className="error">{errorMessage}</div>;
    }

    if (data) {
      return (
        <div className="settings__profile">
          <div>
            Hi{' '}
            <label>
              {data.firstName} {data.lastName}
            </label>
          </div>
        </div>
      );
    }

    return <div></div>;
  }
}

export default connect(mapStateToProps)(Settings);
