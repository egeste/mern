import { createActions } from '../lib/generators'
import * as sessionActions from './session'

export default {
  ...sessionActions,
  ...createActions('/api/v1/users', 'User', 'Users'),
  ...createActions('/api/v1/todos', 'Todo', 'Todos')
}
