import * as actionTypes from '../actions/actionTypes'

function token(state = [], action) {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
    case actionTypes.CHECK_TOKEN_VALID:
      localStorage.setItem('icons.x-access-token', action.data.token)
      return action.data.token; 
    default:
      return state
  }
}

export default token
