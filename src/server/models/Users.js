import bcrypt from 'bcryptjs'
import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { ROLES, ROLE_USER, ROLE_GUEST } from '../../lib/rbac'

import * as schemas from '../../lib/schemas'

const ModelSchema = new Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    lowercase: true,
    validate: value => schemas.email.isValid(value)
  },
  password: {
    type: String,
    required: true,
    validate: value => schemas.password.isValid(value)
  },
  role: {
    type: String,
    enum: ROLES,
    default: ROLE_USER,
    validate: value => schemas.role.isValid(value)
  },
  name: {
    type: String,
    trim: true,
    required: true,
    validate: value => schemas.name.isValid(value)
  },
  services: {
    facebook: {
      id: String,
      token: String
    },
    google: {
      id: String,
      token: String
    }
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
}, {
  timestamps: true
})

ModelSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
})

ModelSchema.methods.verifyPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

ModelSchema.plugin(mongoosePaginate)
ModelSchema.plugin(mongooseUniqueValidator)
ModelSchema.methods.toJSON = function () { return this.toObject() }

const Model = mongoose.model('User', ModelSchema)

export default Model

export const GUEST_USER = new Model({
  _id: 0,
  role: ROLE_GUEST,
  name: 'Anonymous'
})
