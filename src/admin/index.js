import React from 'react'
import { Admin, Resource } from 'react-admin'

import NotFound from './NotFound'

import users from './users'

import authProvider from './providers/auth'
import restProvider from './providers/rest'

import { adminHistory } from '../lib/history'

import './index.scss'

export default props => (
  <div className="admin-app">
    <Admin history={adminHistory}
      dataProvider={restProvider}
      authProvider={authProvider}
      catchAll={NotFound}
    >
      <Resource name="users" {...users} />
      <Resource name="users" {...users} />
    </Admin>
  </div>
)
