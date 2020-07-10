import {
  READ_SESSION, SESSION_READ, SESSION_READ_FAIL,
  CREATE_SESSION, SESSION_CREATE, SESSION_CREATE_FAIL,
  DELETE_SESSION, SESSION_DELETE, SESSION_DELETE_FAIL,
  REGISTER_USER, USER_REGISTER, USER_REGISTER_FAIL
} from '../actions/session'

const DEFAULT_STATE = {
  session: {},
  creatingSession: false,
  readingSession: false,
  deletingSession: false
}

export default (state = DEFAULT_STATE, { type, session } = {}) => {
  switch (type) {
    case READ_SESSION:
      return { ...state, readingSession: true }
    case SESSION_READ:
      return { ...state, session, readingSession: false }
    case SESSION_READ_FAIL:
      return { ...state, readingSession: false }

    case REGISTER_USER:
    case CREATE_SESSION:
      return { ...state, creatingSession: true }
    case USER_REGISTER:
    case SESSION_CREATE:
      return { ...state, session, creatingSession: false }
    case USER_REGISTER_FAIL:
    case SESSION_CREATE_FAIL:
      return { ...state, creatingSession: false }

    case DELETE_SESSION:
      return { ...state, deletingSession: true }
    case SESSION_DELETE:
      return { ...DEFAULT_STATE, session }
    case SESSION_DELETE_FAIL:
      return { ...state, deletingSession: false }

    default:
      return { ...state }
  }
}
