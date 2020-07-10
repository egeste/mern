import {
  createStore,
  applyMiddleware
} from 'redux'

import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'

import createSagaMiddleware from 'redux-saga'
import { all, fork } from 'redux-saga/effects'
import { adminSaga } from 'react-admin'

import history from './history'
import reducers from '../reducers'

import authProvider from '../admin/providers/auth'
import restProvider from '../admin/providers/rest'

const sagaMiddleware = createSagaMiddleware()
const historyMiddleware = routerMiddleware(history)
const middleware = applyMiddleware(sagaMiddleware, historyMiddleware, thunkMiddleware)
const reduxStore = window.reduxStore = createStore(reducers, middleware)

sagaMiddleware.run(function* rootSaga() {
  yield all([
    adminSaga(restProvider, authProvider),
  ].map(fork))
})

export default reduxStore
