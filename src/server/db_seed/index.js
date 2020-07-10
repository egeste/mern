import moment from 'moment'
import Chance from 'chance'

import config from '../config'
import mongoose from '../lib/mongoose'
import {
  ROLES,
  ROLE_ADMINISTRATOR,
  ROLE_MODERATOR,
  ROLE_USER,
  ROLE_GUEST
} from '../../lib/rbac'

import UsersModel from '../models/Users'

const chance = Chance()

const usersCount = chance.integer({ min: 25, max: 50 })

;(async () => {
  try {
    console.info('Connecting to the database...')
    await mongoose.connect(config.mongodb.url, config.mongodb.options)

    console.info('Deleting all records...')
    await UsersModel.deleteMany()

    console.info('Creating users for all roles...')
    await Promise.all(ROLES.map(role => {
      return UsersModel.create({
        role: role,
        email: `${role}@app.com`,
        password: `${role}-password`,
        name: chance.name()
      })
    }))

    console.info(`Creating ${usersCount} random users...`)
    const users = await Promise.all(Array(usersCount).fill().map(async () => {
      return await UsersModel.create({
        role: chance.pickone(ROLES),
        email: chance.email(),
        name: chance.name(),
        password: chance.hash()
      })
    }))
    console.info(`Created ${users.length} users.`)

    await UsersModel.syncIndexes()
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
