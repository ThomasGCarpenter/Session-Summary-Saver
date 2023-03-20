import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'

import './styles.css'

function mapStateToProps(state) {
  return {}
}

class NotFound extends React.Component {
  render() {
    return (
      <div className="not-found">
        <div className="container">
          <h2>Oh No! This page donsn't exist. Have a great day!</h2>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(NotFound)
