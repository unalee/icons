import * as actionTypes from '../actions/actionTypes'

function user(state = [], action) {
  switch (action.type) {
    
    case actionTypes.LOGIN_SUCCESS:
      return {...action.user};
    default:
      return state
  }

}

export default user
