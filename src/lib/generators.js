import ApiSpec, {
  parseContentRange
} from './ApiSpec'

import values from 'lodash/values'
import camelCase from 'lodash/camelCase'

export const createActions = (resourcePath, singular, plural) => {
  const actions = {}

  const pluralCamel = camelCase(plural)
  const singularCamel = camelCase(singular)

  const pluralFilterAction = `filter_${plural}`.toUpperCase()
  const pluralFilterSuccessAction = `${plural}_filter`.toUpperCase()
  const pluralFilterFailureAction = `${plural}_filter_fail`.toUpperCase()

  const pluralReadAction = `read_${plural}`.toUpperCase()
  const pluralReadSuccessAction = `${plural}_read`.toUpperCase()
  const pluralReadFailureAction = `${plural}_read_fail`.toUpperCase()

  const singleCreateAction = `create_${singular}`.toUpperCase()
  const singleCreateSuccessAction = `${singular}_create`.toUpperCase()
  const singleCreateFailureAction = `${singular}_create_fail`.toUpperCase()

  const singleReadAction = `read_${singular}`.toUpperCase()
  const singleReadSuccessAction = `${singular}_read`.toUpperCase()
  const singleReadFailureAction = `${singular}_read_fail`.toUpperCase()

  const singleUpdateAction = `update_${singular}`.toUpperCase()
  const singleUpdateSuccessAction = `${singular}_update`.toUpperCase()
  const singleUpdateFailureAction = `${singular}_update_fail`.toUpperCase()

  const singleDeleteAction = `delete_${singular}`.toUpperCase()
  const singleDeleteSuccessAction = `${singular}_delete`.toUpperCase()
  const singleDeleteFailureAction = `${singular}_delete_fail`.toUpperCase()

  actions[pluralReadAction] = pluralReadAction
  actions[pluralReadSuccessAction] = pluralReadSuccessAction
  actions[pluralReadFailureAction] = pluralReadFailureAction

  actions[pluralFilterAction] = pluralFilterAction
  actions[pluralFilterSuccessAction] = pluralFilterSuccessAction
  actions[pluralFilterFailureAction] = pluralFilterFailureAction

  actions[singleCreateAction] = singleCreateAction
  actions[singleCreateSuccessAction] = singleCreateSuccessAction
  actions[singleCreateFailureAction] = singleCreateFailureAction

  actions[singleReadAction] = singleReadAction
  actions[singleReadSuccessAction] = singleReadSuccessAction
  actions[singleReadFailureAction] = singleReadFailureAction

  actions[singleUpdateAction] = singleUpdateAction
  actions[singleUpdateSuccessAction] = singleUpdateSuccessAction
  actions[singleUpdateFailureAction] = singleUpdateFailureAction

  actions[singleDeleteAction] = singleDeleteAction
  actions[singleDeleteSuccessAction] = singleDeleteSuccessAction
  actions[singleDeleteFailureAction] = singleDeleteFailureAction

  actions[`read${plural}`] = (token, modifyRequest) => {
    return dispatch => {
      dispatch({ type: pluralReadAction })

      const request = new ApiSpec(resourcePath)
      if (typeof modifyRequest === 'function') modifyRequest(request)
      return request.auth(token).end().then(({ body, response }) => {
        const pluralReadSuccess = { type: pluralReadSuccessAction, response }
        pluralReadSuccess[pluralCamel] = body
        dispatch(pluralReadSuccess)
        return { body, response }
      }).catch(error => {
        dispatch({ type: pluralReadFailureAction, error })
        return Promise.reject(error)
      })
    }
  }

  actions[`filter${plural}`] = (token, options = {}, modifyRequest) => {
    const reset = Boolean(options.reset)
    const clear = Boolean(options.clear)
    const skipRequest = Boolean(options.skipRequest)

    const target = options.target || ''
    const filter = options.filter || {}
    const pagination = options.pagination || {}

    return dispatch => {
      const targetedPluralFilterAction = `${pluralFilterAction}_${target}`.toUpperCase()
      const targetedPluralFilterSuccessAction = `${pluralFilterSuccessAction}_${target}`.toUpperCase()
      const targetedPluralFilterFailureAction = `${pluralFilterFailureAction}_${target}`.toUpperCase()

      dispatch({ type: targetedPluralFilterAction, pagination, filter, clear })
      if (skipRequest) {
        dispatch({ type: targetedPluralFilterSuccessAction, pagination, reset: false, [pluralCamel]: [] })
        return Promise.resolve({ body: [] })
      }

      dispatch({ type: pluralReadAction })

      const { skip, limit } = pagination
      const request = new ApiSpec(resourcePath).query({ ...filter, skip, limit })
      if (typeof modifyRequest === 'function') modifyRequest(request)

      return request.auth(token).end().then(({ body, response }) => {
        const { size } = parseContentRange(response.headers.get('content-range'))
        const pagination = { ...options.pagination, total: size }
        dispatch({ type: targetedPluralFilterSuccessAction, response, pagination, reset, [pluralCamel]: body })
        dispatch({ type: pluralReadSuccessAction, response, [pluralCamel]: body })
        return { body, response }
      }).catch(error => {
          dispatch({ type: targetedPluralFilterFailureAction, error })
          dispatch({ type: pluralReadFailureAction, error })
          return Promise.reject(error)
        })
    }
  }

  actions[`create${singular}`] = (token, item, modifyRequest) => {
    return dispatch => {
      dispatch({
        type: singleCreateAction,
        [singularCamel]: item
      })

      const request = new ApiSpec(resourcePath).method('POST').send(item)
      if (typeof modifyRequest === 'function') modifyRequest(request)
      return request.auth(token).end().then(({ body, response }) => {
        const singleCreateSuccess = { type: singleCreateSuccessAction, response }
        singleCreateSuccess[singularCamel] = body
        dispatch(singleCreateSuccess)
        return { body, response }
      }).catch(error => {
        dispatch({
          type: singleCreateFailureAction,
          [singularCamel]: item,
          error
        })
        return Promise.reject(error)
      })
    }
  }

  actions[`read${singular}`] = (token, id, modifyRequest) => {
    return dispatch => {
      const singleRead = { type: singleReadAction, id }
      dispatch(singleRead)

      const request = new ApiSpec(`${resourcePath}/${id}`)
      if (typeof modifyRequest === 'function') modifyRequest(request)
      return request.auth(token).end().then(({ body, response }) => {
        const singleReadSuccess = { type: singleReadSuccessAction, id, response }
        singleReadSuccess[singularCamel] = body
        dispatch(singleReadSuccess)
        return { body, response }
      }).catch(error => {
        dispatch({ type: singleReadFailureAction, error })
        return Promise.reject(error)
      })
    }
  }

  actions[`update${singular}`] = (token, item, modifyRequest) => {
    return dispatch => {
      const singleUpdate = { type: singleUpdateAction }
      singleUpdate[singularCamel] = item
      dispatch(singleUpdate)

      const request = new ApiSpec(`${resourcePath}/${item._id}`).method('PUT').send(item)
      if (typeof modifyRequest === 'function') modifyRequest(request)
      return request.auth(token).end().then(({ body, response }) => {
        const singleUpdateSuccess = { type: singleUpdateSuccessAction, response }
        singleUpdateSuccess[singularCamel] = item
        dispatch(singleUpdateSuccess)
        return { body, response }
      }).catch(error => {
        dispatch({ type: singleUpdateFailureAction, error })
        return Promise.reject(error)
      })
    }
  }

  actions[`delete${singular}`] = (token, id, modifyRequest) => {
    return dispatch => {
      const singleDelete = { type: singleDeleteAction }
      singleDelete[singularCamel] = id
      dispatch(singleDelete)

      const request = new ApiSpec(`${resourcePath}/${id}`).method('DELETE')
      if (typeof modifyRequest === 'function') modifyRequest(request)
      return request.auth(token).end().then(({ response }) => {
        const singleDeleteSuccess = { type: singleDeleteSuccessAction, response }
        singleDeleteSuccess[singularCamel] = id
        dispatch(singleDeleteSuccess)
        return { body: true, response }
      }).catch(error => {
        dispatch({ type: singleDeleteFailureAction, error })
        return Promise.reject(error)
      })
    }
  }

  return actions
}


export const createResourceReducer = (singular, plural, options = {}) => {
  let indexId
  const { idAttribute } = options

  const pluralCamel = camelCase(plural)
  const singularCamel = camelCase(singular)

  const DEFAULT_STATE = {}
  DEFAULT_STATE[pluralCamel] = []
  DEFAULT_STATE[`${pluralCamel}ById`] = {}

  DEFAULT_STATE[`reading${plural}`] = false
  DEFAULT_STATE[`reading${plural}Error`] = false

  DEFAULT_STATE[`creating${singular}`] = false
  DEFAULT_STATE[`creating${singular}Error`] = {}

  DEFAULT_STATE[`reading${singular}`] = false
  DEFAULT_STATE[`reading${singular}Error`] = false

  DEFAULT_STATE[`updating${singular}`] = false
  DEFAULT_STATE[`updating${singular}Error`] = false

  DEFAULT_STATE[`deleting${singular}`] = false
  DEFAULT_STATE[`deleting${singular}Error`] = false

  return (state = DEFAULT_STATE, action = {}) => {
    const newState = {}

    switch (action.type) {
      case `read_${plural}`.toUpperCase():
        newState[`reading${plural}`] = true
        return { ...state, ...newState }

      case `${plural}_read`.toUpperCase():
        newState[`reading${plural}`] = false
        newState[`${pluralCamel}ById`] = { ...state[`${pluralCamel}ById`] }
        action[pluralCamel].forEach(item => {
          indexId = idAttribute ? item[idAttribute] : item.id
          newState[`${pluralCamel}ById`][indexId] = item
        })
        newState[pluralCamel] = values(newState[`${pluralCamel}ById`])
        return { ...state, ...newState }

      case `${plural}_read_fail`.toUpperCase():
        newState[`reading${plural}`] = false
        newState[`reading${plural}Error`] = action.error
        return { ...state, ...newState }

      case `create_${singular}`.toUpperCase():
        newState[`creating${singular}`] = action[singularCamel]
        return { ...state, ...newState }

      case `${singular}_create`.toUpperCase():
        indexId = idAttribute ? action[singularCamel][idAttribute] : action[singularCamel].id
        newState[`creating${singular}`] = false
        newState[`${pluralCamel}ById`] = { ...state[`${pluralCamel}ById`] }
        newState[`${pluralCamel}ById`][indexId] = action[singularCamel]
        newState[pluralCamel] = values(newState[`${pluralCamel}ById`])
        return { ...state, ...newState }

      case `${singular}_create_fail`.toUpperCase():
        newState[`creating${singular}`] = false
        return { ...state, ...newState }

      case `read_${singular}`.toUpperCase():
        newState[`reading${singular}`] = action.id
        return { ...state, ...newState }

      case `${singular}_read`.toUpperCase():
        newState[`reading${singular}`] = false
        newState[`${pluralCamel}ById`] = { ...state[`${pluralCamel}ById`] }
        newState[`${pluralCamel}ById`][action.id] = action[singularCamel]
        newState[pluralCamel] = values(newState[`${pluralCamel}ById`])
        return { ...state, ...newState }

      case `${singular}_read_fail`.toUpperCase():
        newState[`reading${singular}`] = false
        newState[`reading${singular}Error`] = action.error
        return { ...state, ...newState }

      case `update_${singular}`.toUpperCase():
        newState[`updating${singular}`] = action[singularCamel]
        return { ...state, ...newState }

      case `${singular}_update`.toUpperCase():
        indexId = idAttribute ? action[singularCamel][idAttribute] : action[singularCamel].id
        newState[`updating${singular}`] = false
        newState[`${pluralCamel}ById`] = { ...state[`${pluralCamel}ById`] }
        newState[`${pluralCamel}ById`][indexId] = { ...state[`${pluralCamel}ById`][indexId], ...action[singularCamel] }
        newState[pluralCamel] = values(newState[`${pluralCamel}ById`])
        return { ...state, ...newState }

      case `${singular}_update_fail`.toUpperCase():
        newState[`updating${singular}`] = false
        newState[`updating${singular}Error`] = action.error
        return { ...state, ...newState }

      case `delete_${singular}`.toUpperCase():
        newState[`deleting${singular}`] = action[singularCamel]
        return { ...state, ...newState }

      case `${singular}_delete`.toUpperCase():
        indexId = idAttribute ? action[singularCamel][idAttribute] : action[singularCamel].id
        newState[`deleting${singular}`] = false
        newState[`${pluralCamel}ById`] = { ...state[`${pluralCamel}ById`] }
        delete newState[`${pluralCamel}ById`][indexId]
        newState[pluralCamel] = values(newState[`${pluralCamel}ById`])
        return { ...state, ...newState }

      case `${singular}_delete_fail`.toUpperCase():
        newState[`deleting${singular}`] = false
        newState[`deleting${singular}Error`] = action.error
        return { ...state, ...newState }

      default:
        return { ...state }
    }
  }
}

export const createFilteredResourceReducer = (singular, plural, options) => {
  const filter = options.filter || {}
  const target = options.target || ''
  const pagination = options.pagination || { skip: 0, limit: 10 }
  const idAttribute = options.idAttribute || 'id'

  const singularCamel = camelCase(singular)
  const pluralCamel = camelCase(plural)

  const DEFAULT_STATE = {
    INITIAL_FILTER: filter,
    [pluralCamel]: [],
    [`${pluralCamel}Filter`]: filter,
    [`${pluralCamel}Pagination`]: pagination,
    [`reading${plural}`]: false,
    [`reading${plural}Error`]: false
  }

  return (state = DEFAULT_STATE, action = {}) => {
    const newState = {}

    switch (action.type) {
      case `filter_${pluralCamel}_${target}`.toUpperCase():
        newState[`reading${plural}`] = true
        if (action.filter) newState[`${pluralCamel}Filter`] = { ...action.filter }
        if (action.clear) newState[pluralCamel] = DEFAULT_STATE[pluralCamel]
        return { ...state, ...newState }

      case `${pluralCamel}_filter_${target}`.toUpperCase():
        newState[`reading${plural}`] = false

        newState[pluralCamel] = action.reset
          ? [...action[pluralCamel]]
          : [...state[pluralCamel], ...action[pluralCamel]]

        newState[`${pluralCamel}Pagination`] = { ...action.pagination }
        return { ...state, ...newState }

      case `${pluralCamel}_filter_fail_${target}`.toUpperCase():
        newState[`reading${plural}`] = false
        newState[`reading${plural}Error`] = action.error
        return { ...state, ...newState }

      // When a cached resource is deleted, also delete it from the filtered state
      case `${singular}_delete`.toUpperCase():
        newState[pluralCamel] = state[pluralCamel].filter(item => {
          return item[idAttribute] !== action[singularCamel][idAttribute]
        })
        return { ...state, ...newState }

      default:
        return { ...state }
    }
  }
}
