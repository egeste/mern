import { name as title, version, description } from '../../../package.json'
import { Router } from 'express'
import swaggerUI from 'swagger-ui-express'
import passport from '../auth/passport'
import rbac from '../../lib/rbac'

const specificationTemplate = {
  openapi: '3.0.0',
  info: {
    title, version, description,
    contact: { name: 'admin@app.com' }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
}

export default resources => {
  const { paths, definitions } = Object.entries(resources).reduce((memo, [ name, resource ]) => {
    const { paths, definitions } = resource.swagger()
    return { paths: { ...memo.paths, ...paths }, definitions: { ...memo.definitions, ...definitions } }
  }, { paths: {}, definitions: {} })


  const documentationRouter = new Router()

  documentationRouter.use(passport.authenticate('session'))

  documentationRouter.use((req, res, next) => {
    if (!req.user) return res.sendStatus(401)

    const permission = rbac.can(req.user.role).readAny('docs')
    if (!permission.granted) return res.sendStatus(403)

    next()
  })

  documentationRouter.use((req, res, next) => {
    res.specification = {
      ...specificationTemplate,
      paths, definitions,
      servers: [{ url: `${req.protocol}://${req.headers['host']}/api/v1` }]
    }
    next()
  })

  documentationRouter.get('/swagger.json', (req, res) => res.json(res.specification))
  documentationRouter.use(swaggerUI.serve, (req, res, next) => {
    return swaggerUI.setup(res.specification)(req, res, next)
  })

  return documentationRouter
}
