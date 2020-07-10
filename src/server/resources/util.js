import rbac from '../../lib/rbac'

export const beforeCreate = function (req, res, next) {
  req.permission = rbac.can(req.user.role).createAny(this.name)
  if (!req.permission.granted) return res.sendStatus(401)

  req.body = req.permission.filter(req.body)
  return next()
}

export const before = function (req, res, next) {
  req.permission = rbac.can(req.user.role).readAny(this.name)
  if (!req.permission.granted) return res.sendStatus(401)

  return next()
}

export const beforeUpdate = function (req, res, next) {
  return this.model.findOne({ _id: req.body._id }, (err, model) => {
    if (err) return res.sendStatus(500)
    if (!model) return res.sendStatus(400)

    res.model = model

    req.permission = model
      ? rbac.can(req.user.role).updateOwn(this.name)
      : rbac.can(req.user.role).updateAny(this.name)

    if (!req.permission.granted) return res.sendStatus(401)

    req.body = { ...model.toJSON(), ...req.permission.filter(req.body) }
    return  next()
  })
}

export const beforeDelete = function (req, res, next) {
  req.permission = rbac.can(req.user.role).deleteAny(this.name)
  if (!req.permission.granted) return res.sendStatus(401)

  return next()
}

export const after = function (req, res, next) {
  res.resource.item = Array.isArray(res.resource.item)
    ? res.resource.item.map(req.permission.filter.bind(req.permission))
    : req.permission.filter(res.resource.item)

  return next()
}

export const afterCreateUpdate = function (req, res) {
  if (!res.resource.item) return res.sendStatus(500)

  const permission = (res.resource.item === req.user._id)
    ? rbac.can(req.user.role).readOwn(this.name)
    : rbac.can(req.user.role).readAny(this.name)

  if (!permission.granted) return res.sendStatus(401)

  return res.status(200).json(permission.filter(res.resource.item.toJSON()))
}
