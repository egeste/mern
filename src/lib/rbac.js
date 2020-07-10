import RBAC from 'accesscontrol'

const rbac = new RBAC()

export const ROLE_ADMINISTRATOR = 'admin'
export const ROLE_MODERATOR = 'moderator'
export const ROLE_USER = 'user'
export const ROLE_GUEST = 'guest'

export const ROLES = [
  ROLE_ADMINISTRATOR,
  ROLE_MODERATOR,
  ROLE_USER,
  ROLE_GUEST
]

rbac.grant(ROLE_GUEST)
  .readAny('app')
  .readAny('docs')
  .createOwn('session')
  .readOwn('session', ['_id', 'role'])
  .readAny('users', ['_id', 'role', 'name'])

rbac.grant(ROLE_USER)
  .extend(ROLE_GUEST)
  .readOwn('session', ['email', 'name'])
  .readOwn('users', ['email', 'name'])
  .updateOwn('users', ['name'])
  .deleteOwn('users')

rbac.grant(ROLE_MODERATOR)
  .extend(ROLE_USER)
  .readAny('users', ['email', 'createdAt', 'updatedAt'])
  .updateAny('users', ['name'])

rbac.grant(ROLE_ADMINISTRATOR)
  .extend(ROLE_MODERATOR)
  .readAny('admin')
  .updateAny('users', ['role'])

export default rbac
