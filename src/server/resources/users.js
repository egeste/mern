import resource from 'resourcejs'
import { Router } from 'express'

import UsersModel from '../models/Users'
import rbac from '../../lib/rbac'

import {
  before,
  beforeCreate,
  beforeUpdate,
  after,
  afterUpdateCreate
} from './util'

const usersRouter = new Router()

export const users = resource(usersRouter, '', 'users', UsersModel)
users.get({ after, before })
users.index({ after, before })
users.post({ after: afterUpdateCreate, before: beforeCreate })
users.put({ after: afterUpdateCreate, before: beforeUpdate })

export default usersRouter
