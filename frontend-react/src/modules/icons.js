import * as actionTypes from '../actions/actionTypes'

function icons(state = [], action) {
  switch (action.type) {
    case actionTypes.GET_ICONS_RECEIVED:
      return [...action.data];
    default:
      return state
  }
}

export default icons
