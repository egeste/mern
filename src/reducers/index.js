import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { adminReducer } from 'react-admin'
import { adminHistory } from '../lib/history'

import {
  createResourceReducer,
  createFilteredResourceReducer
} from '../lib/generators'

import session from './session'

// Resources
const users = createResourceReducer('User', 'Users',  { idAttribute: '_id' })

export default combineReducers({
  // React-Admin reducers
  admin: adminReducer,
  router: connectRouter(adminHistory),

  // Auth & session
  session,

  // Resources
  users
})
