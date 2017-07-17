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
          const data = JSON.parse(res.text)
          return next({
            type: actionTypes.LOGIN_SUCCESS,
            data
          })
        })
      break;

    case actionTypes.LOGOUT:
      console.log('logout', action);
      break;

    case actionTypes.CHECK_TOKEN:
      console.log('logout', action);
      if (!action.token) {
        return next({
          type: actionTypes.CHECK_TOKEN_INVALID
        })
      } else {
        request
          .post('/auth/token')
          .set('x-access-token', action.token)
          .end((error, res) => {
            if (error) {
              return next({
                type: actionTypes.CHECK_TOKEN_ERROR
              })
            }
            const data = JSON.parse(res.text)
            if (data.valid) {
              return next({
                type: actionTypes.CHECK_TOKEN_VALID,
                token: action.token
              })
            } else {
              return next({
                type: actionTypes.CHECK_TOKEN_INVALID
              })
            }
          })
      }
      
      break;

  }
}

export default userService
