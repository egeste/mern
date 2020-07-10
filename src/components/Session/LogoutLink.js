import React from 'react'

import { connect } from 'react-redux'
import actions from '../../actions'

/* eslint-disable */
export default connect(null, {
  onClick: () => actions.deleteSession()
})(props => <a {...props} />)
