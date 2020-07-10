import React, { Component } from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

export default withRouter(connect(state => ({ state }))(
  class PrivateRoute extends Component {
    render() {
      const { state, accessible, redirect, ...otherProps } = this.props
      return accessible(state) ? (<Route {...otherProps} />) : (<Redirect to={redirect} />)
    }
  }
))
