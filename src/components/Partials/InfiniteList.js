import omit from 'lodash/omit'
import React, { Component } from 'react'

import InfiniteScroll from './InfiniteScroll'

export default class InfiniteList extends Component {

  onNextPage = () => {
    const { pagination, onFilterData } = this.props
    const skip = pagination.skip + pagination.limit
    return onFilterData({ pagination: { skip } })
  }

  render() {
    const { records, pagination, ...remainingProps } = this.props
    const lastRecord = pagination.skip + pagination.limit
    const otherProps = omit(remainingProps, 'onFilterData')

    return (
      <InfiniteScroll
        hasMore={(lastRecord <= pagination.total)}
        dataLength={records.length}
        { ...otherProps }
        next={this.onNextPage}
       />
    )
  }

}
