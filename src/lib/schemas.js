import * as yup from 'yup'
import { ROLES } from './rbac'

// User
export const name = yup.string()
  .min(3, 'That name is too short for our database. Sorry!')
  .min(128, 'That name is too long for our database. Sorry!')
  .required()

export const email = yup.string()
  .email('Must be a valid email')
  .required()

export const password = yup.string()
  .min(8, 'Passwords must be at least 8 characters')
  .required()

export const role = yup.string()
  .oneOf(ROLES, 'Invalid role provided')
  .required()

// Auth
export const confirm = yup.string()
  .oneOf([yup.ref('password'), null], 'Passwords must match')

export const login = yup.object({ email, password })

export const signup = yup.object({ name, email, password, confirm })
