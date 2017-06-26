import * as actionTypes from '../actions/actionTypes'

function user(state = [], action) {
  switch (action.type) {
    
    case actionTypes.LOGIN_SUCCESS:
    debugger;
      localStorage.setItem('icons.x-access-token', action.data.token)
      return {...action.data.user}; 
    default:
      return state
  }

}

export default user
