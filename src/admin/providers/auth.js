import get from 'lodash/get'
import rbac, { ROLE_ADMINISTRATOR, ROLE_GUEST } from '../../lib/rbac'
import actions from '../../actions'

// Don't know why this is necessary... Maybe something to do with `import()`?
const store = () => require('../../lib/reduxStore').default
const dispatch = action => store().dispatch(action)
const userRole = () => get(store().getState().session, 'session.user.role') || ROLE_GUEST

export default {
  login: (({ username, password }) => dispatch(actions.createSession({ password, email: username }))),
  logout: (() => dispatch(actions.deleteSession())),
  checkAuth: (() => (userRole() === ROLE_ADMINISTRATOR) ? Promise.resolve() : Promise.reject()),
  checkError: (({ status }) => ([401, 403].includes(status)) ? Promise.reject() : Promise.resolve()),
  getPermissions: (() => Promise.resolve(rbac.can(userRole())))
}
