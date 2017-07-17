import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import icons from './icons'
import user from './user'
import token from './token'

export default combineReducers({
  icons,
  user,
  token,
  router: routerReducer
})
