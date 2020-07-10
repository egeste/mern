import ApiSpec from '../lib/ApiSpec'

export const CREATE_SESSION = 'CREATE_SESSION'
export const SESSION_CREATE = 'SESSION_CREATE'
export const SESSION_CREATE_FAIL = 'SESSION_CREATE_FAIL'

export const createSession = form => dispatch => {
  dispatch({ type: CREATE_SESSION })
  return new ApiSpec('/api/v1/auth/session')
    .method('POST').send(form).end()
    .then(response => {
      dispatch({ type: SESSION_CREATE, session: response.body })
      return response
    }).catch(error => {
      dispatch({ type: SESSION_CREATE_FAIL })
      return Promise.reject(error)
    })
}

export const READ_SESSION = 'READ_SESSION'
export const SESSION_READ = 'SESSION_READ'
export const SESSION_READ_FAIL = 'SESSION_READ_FAIL'

export const readSession = () => dispatch => {
  dispatch({ type: READ_SESSION })
  return new ApiSpec('/api/v1/auth/session').end().then(response => {
    dispatch({ type: SESSION_READ, session: response.body })
    return response
  }).catch(error => {
    dispatch({ type: SESSION_READ_FAIL })
    return Promise.reject(error)
  })
}

export const DELETE_SESSION = 'DELETE_SESSION'
export const SESSION_DELETE = 'SESSION_DELETE'
export const SESSION_DELETE_FAIL = 'SESSION_DELETE_FAIL'

export const deleteSession = () => dispatch => {
  dispatch({ type: DELETE_SESSION })
  return new ApiSpec('/api/v1/auth/session')
    .method('DELETE').end()
    .then(response => {
      dispatch({ type: SESSION_DELETE, session: response.body })
      return response
    }).catch(error => {
      dispatch({ type: SESSION_DELETE_FAIL })
      return Promise.reject(error)
    })
}

export const REGISTER_USER = 'REGISTER_USER'
export const USER_REGISTER = 'USER_REGISTER'
export const USER_REGISTER_FAIL = 'USER_REGISTER_FAIL'

export const registerUser = registration => dispatch => {
  dispatch({ type: REGISTER_USER })
  return new ApiSpec('/api/v1/auth/register')
    .method('POST').send(registration).end()
    .then(response => {
      dispatch({ type: USER_REGISTER, session: response.body })
      return response
    }).catch(error => {
      dispatch({ type: USER_REGISTER_FAIL })
      return Promise.reject(error)
    })
}
