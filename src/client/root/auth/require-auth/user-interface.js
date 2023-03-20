import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';

import SignIn from '../sign-in/user-interface';

function RequireAuthWrapper(WrappedComponent) {
  function mapStateToProps(state) {
    return {
      userRequest: state.auth.user.userRequest
    };
  }

  class RequireAuth extends React.Component {
    static propTypes = {
      userRequest: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        data: PropTypes.object
      })
    };

    render() {
      const { userRequest } = this.props;
      if (userRequest.loading === false && userRequest.data) {
        return <WrappedComponent {...this.props} />;
      }

      return <SignIn />;
    }
  }

  return connect(mapStateToProps)(RequireAuth);
}

export default RequireAuthWrapper;
