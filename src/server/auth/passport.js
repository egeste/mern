import passport from 'passport'
import LocalStrategy from 'passport-local'
import { BasicStrategy } from 'passport-http'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

import UsersModel, { GUEST_USER } from '../models/Users'

import config from '../config'

passport.serializeUser((user, done) => done(null, user._id))

passport.deserializeUser((id, done) => {
  if (!id) return done(null, GUEST_USER)
  UsersModel.findById(id, (err, user) => {
    if (err) return done(err)
    if (!user) return done(null, GUEST_USER)
    done(null, user)
  })
})

const authEmailPassword = (email, password, done) => {
  UsersModel.findOne({ email }).exec((err, user) => {
    if (err) return done(err)

    if (!user || !user.verifyPassword(password)) {
      return done('Authentication failed')
    }

    return done(null, user)
  })
}

passport.use(new BasicStrategy(authEmailPassword))
passport.use(new LocalStrategy({ usernameField: 'email' }, authEmailPassword))

passport.use(new JwtStrategy({
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer')
}, (payload, done) => {
  if (!payload._id) return done(null, GUEST_USER)
  UsersModel.findOne({ _id: payload._id }).exec((err, user) => {
    if (err) return done(err, false)
    if (!user) return done(null, GUEST_USER)
    done(null, user)
  })
}))

export default passport
