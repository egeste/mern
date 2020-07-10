import React, { Component } from 'react'

import { Router, Route, Switch } from 'react-router-dom'

import loadable from '@loadable/component'

import AppLayout from './components/Layouts/App'

import PrivateRoute from './components/Routes/Private'

import Homepage from './components/Homepage'
import Login from './components/Session/Login'
import Signup from './components/Session/Signup'

import { connect } from 'react-redux'
import actions from './actions'

import history from './lib/history'

import rbac from './lib/rbac'

import './App.scss'

const AdminBundle = loadable(() => import('./admin'), {
  fallback: (<h5 className="">Loading...</h5>)
})

export default connect(state => ({
  session: state.session.session,
  readingSession: state.session.readSession
}), actions)(class App extends Component {

  componentDidMount = () => this.readSession()
  componentDidUpdate = () => this.readSession()

  readSession = () => {
    if (!this.props.session.user && !this.props.readingSession) {
      this.props.readSession()
    }
  }

  render() {
    const { session } = this.props

    if (!session.user) return null
    const canAdmin = state => rbac.can(state.session.session.user.role).readAny('admin').granted
    const canLogin = state => !rbac.can(state.session.session.user.role).deleteOwn('session').granted
    const canSignup = state => !rbac.can(state.session.session.user.role).deleteOwn('session').granted

    return (
      <Router history={history}>
        <Switch>

          <PrivateRoute exact path="/login" redirect="/" accessible={canLogin}>
            <Login />
          </PrivateRoute>

          <PrivateRoute exact path="/signup" redirect="/" accessible={canSignup}>
            <Signup />
          </PrivateRoute>

          <PrivateRoute path="/admin" redirect="/" accessible={canAdmin}>
            <AdminBundle />
          </PrivateRoute>

          <Route path="/">
            <AppLayout>
              <Switch>
                <Route exact path="/">
                  <Homepage />
                </Route>
              </Switch>
            </AppLayout>
          </Route>

        </Switch>
      </Router>
    )
  }

})
