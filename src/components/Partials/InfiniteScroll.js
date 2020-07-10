import React from 'react'
import InfiniteScrollComponent from 'react-infinite-scroll-component'

export default class InfiniteScroll extends InfiniteScrollComponent {
  static defaultProps = {
    ...InfiniteScrollComponent.defaultProps,
    loader: (<h6 className="text-center"children="Loading..." />),
    endMessage: (<h6 className="text-center" children="End of list" />),
    releaseToRefreshContent: (<h6 className="text-center">&#8593; Release to refresh</h6>),
    pullDownToRefreshContent: (<h6 className="text-center">&#8595; Pull down to refresh</h6>)
  }
}
