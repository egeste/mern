import qs from 'qs'
import omit from 'lodash/omit'
import fetch from 'isomorphic-fetch'
import defaultsDeep from 'lodash/defaultsDeep'

// Globally configurable static defaults
let configOptions = {
  qsOptions: { arrayFormat: 'comma' }
}

export const getConfiguration = () => {
  return configOptions
}

const validateStatus = response => {
  return response.status < 200 || response.status >= 400
    ? Promise.reject(response)
    : Promise.resolve(response)
}

export const parseContentRange = cr => {
  const contentRangeRegExp = /\w*\s?(\d+)-(\d+)\/(\d+)/
  if (!contentRangeRegExp.test(cr)) return {}

  const [ _start, _end, _size ] = contentRangeRegExp.exec(cr).slice(1)
  return { start: parseInt(_start), end: parseInt(_end), size: parseInt(_size) }
}

export default class ApiSpec {
  constructor(resourceRoot, options = {}) {
    this.url = resourceRoot
    this.params = {}

    const defaultOptions = defaultsDeep(options, configOptions)
    this.options = omit(defaultOptions, 'qsOptions')
    this.qsOptions = defaultOptions.qsOptions || {}
    this.parseJSON = this.parseJSON.bind(this)
    this.parseText = this.parseText.bind(this)

    return this.asJSON() // Default to JSON
  }

  method(method) {
    this.options = { ...this.options, method }
    return this
  }

  query(query) {
    this.params = { ...this.params, ...query }
    return this
  }

  auth(token) {
    this.options.headers = {
      Authorization: `Bearer ${token}`,
      ...this.options.headers
    }
    return this
  }

  send(body) {
    body = JSON.stringify(body)
    const headers = {
      ...this.options.headers,
      'Content-Type': 'application/json'
    }
    this.options = { ...this.options, headers, body }
    return this
  }

  sendFile(file) {
    let body = new FormData()
    body.append('file', file)
    this.options = { ...this.options, body }
    return this
  }

  asJSON() {
    this.parser = this.parseJSON
    return this
  }

  asText() {
    this.parser = this.parseText
    return this
  }

  build() {
    const headers = { ...this.options.headers }
    const options = { ...this.options, headers }
    const params = { ...this.params, filter: JSON.stringify(this.params.filter) }
    const query = qs.stringify(params, this.qsOptions)
    const url = query ? `${this.url}?${query}` : this.url
    return { url, options }
  }

  parseJSON(jsonResponse) {
    return validateStatus(jsonResponse).then(response => {
      return response.json()
        .then(body => Promise.resolve({ response, body }))
        .catch(error => Promise.resolve({ response, error }))
    })
  }

  parseText(textResponse) {
    return validateStatus(textResponse).then(response => {
      return response.text()
        .then(body => Promise.resolve({ body, response }))
        .catch(error => Promise.resolve({ error, response }))
    })
  }

  end() {
    const { url, options } = this.build()
    return fetch(url, options).then(this.parser)
  }

  static configure(options = {}) {
    configOptions = defaultsDeep(options, configOptions)
  }
}
