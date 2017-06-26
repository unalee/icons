import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import icons from './icons'
import user from './user'

export default combineReducers({
  icons,
  user,
  router: routerReducer
})
