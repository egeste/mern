import get from 'lodash/get'
import ApiSpec, { parseContentRange } from '../../lib/ApiSpec'

const formatRecord = record => ({ ...record, id: record._id })
const formatRecords = records => records.map(formatRecord)

const req = res => new ApiSpec(`/api/v1/${res}`).auth(userToken())
const format = ({ body }) => ({ data: formatRecord(body) })

// Don't know why this is necessary... Maybe something to do with `import()`?
const store = () => require('../../lib/reduxStore').default
const userToken = () => get(store().getState().session, 'session.token')

export default {
  create: ((res, params) => req(res).send(params.data).method('POST').end().then(format)),
  update: ((res, params) => req(`${res}/${params.id}`).send(params.data).method('PUT').end().then(format)),
  delete: ((res, params) => req(`${res}/${params.id}`).method('DELETE').end().then(format)),
  getOne: ((res, params) => req(`${res}/${params.id}`).end().then(format)),

  getList: (res, params) => {
    return req(res).query({
      sort: ((params.sort && params.sort.order === 'DESC') ?`-${params.sort.field}` : params.sort.field),
      skip: (params.pagination.perPage * (params.pagination.page - 1)),
      limit: params.pagination.perPage,
    }).end().then(({ response, body }) => ({
      data: formatRecords(body),
      total: parseContentRange(response.headers.get('content-range')).size
    }))
  },

  getMany: (res, params) => {
    return req(res).query({
      _id__in: params.ids.join(',')
    }).end().then(({ response, body }) => ({
      data: formatRecords(body)
    }))
  },

  getManyReference: (res, params) => {
    console.warn('getManyReference not implemented', { res, params })
    return Promise.resolve({ data:[] })
  }
}
