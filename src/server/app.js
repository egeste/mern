import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import session from 'express-session'
import bodyParser from 'body-parser'
import compression from 'compression'

import express, { Router } from 'express'

import mongoose from './lib/mongoose'
import passport from './auth/passport'
import config from './config'

import apiRouter from './api'

import rbac from '../lib/rbac'
import UsersModel, { GUEST_USER } from './models/Users'

import connectMemcached from 'connect-mongo'
const MongoStore = require('connect-mongo')(session)

const staticPath = path.resolve(__dirname, '..', '..', 'build')

const appRouter = new Router()

// Start the database connection
mongoose.connect(config.mongodb.url, config.mongodb.options)

// Security
appRouter.use(helmet())
appRouter.use(morgan())
appRouter.use(compression())
// appRouter.use(cors())

// Enable sessions
appRouter.use(session({
  secret: config.session.secret,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// Use our passport authentication
appRouter.use(passport.initialize())
appRouter.use(passport.session())

appRouter.use(passport.authenticate('session'), (req, res, next) => {
  const user = req.user || GUEST_USER
  const authorized = rbac.can(user.role).readAny('app').granted
  if (!authorized) return res.sendStatus(401)
  return next()
})

// Serve static content
appRouter.use(express.static(staticPath))

// Parse request bodies
appRouter.use(bodyParser.urlencoded({ extended: true }))
appRouter.use(bodyParser.json())

// Inject the API router
appRouter.use('/api/v1', apiRouter, (req, res, next) => {
  if (res.headersSent) return // Nothing else to do
  next()
})

appRouter.get('*', (req, res, next) => {
  res.sendFile(path.resolve(staticPath, 'index.html'))
})

export default appRouter
