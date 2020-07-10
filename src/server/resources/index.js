import { Router } from 'express'

import passport from '../auth/passport'

import usersRouter, { users } from './users'

const resourcesRouter = new Router()

resourcesRouter.use(passport.authenticate('jwt'))
resourcesRouter.use(usersRouter)

export const resources = {
  users
}

export default resourcesRouter
