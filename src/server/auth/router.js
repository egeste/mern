import get from 'lodash/get'
import pick from 'lodash/pick'
import isEmpty from 'lodash/isEmpty'

import { Router } from 'express'

import passport from './passport'

import { signJwt } from '../lib/jwt'

import * as schemas from '../../lib/schemas'
import rbac, { ROLE_GUEST } from '../../lib/rbac'
import UsersModel, { GUEST_USER } from '../models/Users'

const authRouter = new Router()

const formatSession = (passportUser = GUEST_USER.toJSON()) => {
  const user = rbac.can(passportUser.role).readOwn('session').filter(passportUser)
  const token = signJwt(user)
  return { user, token }
}

const validateRequest = (schema, attribute) => (req, res, next) => {
  return schema.isValid(get(req, attribute))
    .then(() => next())
    .catch(err => {
      return res.status(400).json({ reason: 'Validation failed' })
    })
}

authRouter.post('/register',
  validateRequest(schemas.signup, 'body'),
  (req, res) => {
    const { email, password, name } = req.body
    const userAttributes = pick(req.body, 'email', 'password', 'name')
    UsersModel.create(userAttributes).then(user => {
      res.status(200).json(formatSession(user.toJSON()))
    }).catch(reason => {
      res.status(500).json({ reason })
    })
  }
)

authRouter.post('/session',
  validateRequest(schemas.login, 'body'),
  passport.authenticate('local'),
  (req, res) => res.status(201).json(formatSession(req.user.toJSON()))
)

authRouter.get('/session',
  passport.authenticate('session'),
  (req, res) => res.status(200).json(formatSession(req.user && req.user.toJSON()))
)

authRouter.delete('/session', (req, res) => {
  req.logout()
  res.status(200).json(formatSession())
})

// authRouter.post('/check-email')
// authRouter.post('/check-username')
// authRouter.post('/forgot-password')
// authRouter.post('/verify-code')
// authRouter.post('/reset-password')

// authRouter.post('/facebook',
//   passport.authenticate('facebook-token'),
//   (req, res) => res.status(201).json(formatSession(req.user))
// )

// authRouter.post('/google',
//   passport.authenticate('google-token'),
//   (req, res) => res.status(201).json(formatSession(req.user))
// )

export default authRouter
