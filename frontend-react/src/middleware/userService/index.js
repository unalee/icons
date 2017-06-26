import request  from 'superagent'
import * as actionTypes from '../../actions/actionTypes'

const jsonHeader = {
	'Content-Type': 'application/json'
}

const userService = store => next => action => {
  next(action)
  switch (action.type) {
    case actionTypes.CREATE_ACCOUNT:
      request
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .send({
          email: action.email,
          password: action.password
        })
        .end((error, res) => {
          if (error) {
            return next({
              type: actionTypes.CREATE_ACCOUNT_ERROR,
              error
            })

          }
          const data = JSON.parse(res.text)
          return next({
            type: actionTypes.CREATE_ACCOUNT_SUCCESS,
            data
          })
        })
      break

    case actionTypes.LOGIN:
      debugger;
      request.post('/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: action.email,
          password: action.password
        })
        .end((error, res) => {
          if (error) {
            return next({
              type: actionTypes.LOGIN_ERROR,
              error
            });
          }
          debugger;
          const user = JSON.parse(res.text)
          return next({
            type: actionTypes.LOGIN_SUCCESS,
            user
          })
        })
      break;

    case actionTypes.LOGOUT:
      console.log('logout', action);
      break;

    case actionTypes.CHECK_TOKEN:
      console.log('logout', action);
      break;

  }
}

export default userService
