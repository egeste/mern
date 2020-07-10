import qs from 'qs'
import omit from 'lodash/omit'
import isEqual from 'lodash/isEqual'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'

import React, { Component } from 'react'

export const parseFilterQuery = queryString => {
  return qs.parse(queryString, { arrayFormat: 'brackets', ignoreQueryPrefix: true })
}

export const stringifyFilterParams = (paramsObject, options = {}) => {
  return qs.stringify(paramsObject, { arrayFormat: 'brackets' })
}

export const rTrim = filter => {
  if (isArray(filter)) {
    return filter.reduce((memo, value) => {
      if (value == null) return memo
      if (isObject(value)) return [...memo, rTrim(value)]
      return [...memo, value]
    }, [])
  }

  return Object.keys(filter).reduce((memo, filterKey) => {
    const value = filter[filterKey]
    if (value == null) return memo
    if (isObject(value)) return { ...memo, [filterKey]: rTrim(value) }
    return { ...memo, [filterKey]: value }
  }, {})
}

export default mapProps => {
  return ComposedComponent => {
    return class QueryParamFilterSync extends Component {
      /*** mapProps Interface
      * The params from the url.
      * > filter: PropTypes.shape({})
      *
      * The current filter state of the resource.
      * > params: PropTypes.shape({})
      *
      * Callback for updating the query params.
      * If you don't care about the difference between `onSetFilter` and `onUpdateFilter`
      * you can just provide the same function for both:
      * > onSetFilter: PropTypes.func
      *
      * Callback for updating the filter when it should be reset with a new set of values.
      * > onUpdateFilter: PropTypes.func
      *
      * Callback for updating the filter when it should be updated by appending more values to it.
      * > onUpdateParams: PropTypes.func
      */

      componentDidMount() {
        const { filter, params, onSetFilter, onUpdateFilter } = mapProps(this.props)

        if (!isEqual(filter, params)) {
          if (Object.keys(params).length) {
            onSetFilter(rTrim(params))
          } else {
            onUpdateFilter(rTrim(params))
          }
        }
      }

      componentDidUpdate(prevProps) {
        const { filter: prevFilter, params: prevParams } = mapProps(prevProps)
        const { filter, params, onUpdateFilter, onUpdateParams, onSetFilter } = mapProps(this.props)

        const trimmedParams = rTrim(params)
        const trimmedFilter = rTrim(filter)

        // Handle a change in url params
        if (!isEqual(trimmedParams, rTrim(prevParams))) {
          return Object.keys(trimmedParams).length ? onSetFilter(trimmedParams) : onUpdateFilter(trimmedParams)
        }

        // Handle a filter update
        if (!isEqual(trimmedFilter, rTrim(prevFilter)) || !isEqual(trimmedFilter, trimmedParams)) {
          return onUpdateParams(trimmedFilter)
        }
      }

      render() {
        const omitProps = ['filter', 'params', 'onUpdateFilter', 'onUpdateParams']
        return <ComposedComponent {...omit(this.props, omitProps)} />
      }
    }
  }
}
