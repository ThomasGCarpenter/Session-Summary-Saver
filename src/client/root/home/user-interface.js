import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import SignIn from '../auth/sign-in/user-interface';
import Welcome from '../welcome/user-interface';

function mapStateToProps(state) {
  return {
    userRequest: state.auth.user.userRequest
  };
}

class Home extends React.Component {
  static propTypes = {
    userRequest: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      data: PropTypes.object
    })
  };

  render() {
    if (this.props.userRequest.loading === false) {
      if (this.props.userRequest.data) {
        return <Welcome />;
      } else {
        return <SignIn />;
      }
    }

    return null;
  }
}

export default connect(mapStateToProps)(Home);
