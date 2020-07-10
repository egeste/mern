import { Router } from 'express'

import authenticate from './auth/router'

import documentation from './lib/documentation'
import resourceRouter, { resources } from './resources'

const apiRouter = new Router()

apiRouter.use('/auth', authenticate)
apiRouter.use('/docs', documentation(resources))
apiRouter.use(resourceRouter)

export default apiRouter
