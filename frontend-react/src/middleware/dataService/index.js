import request  from 'superagent'
import * as actionTypes from '../../actions/actionTypes'

const dataService = store => next => action => {
  console.log(action);
  next(action)
  switch (action.type) {
    case actionTypes.GET_ALL_ICONS:

      request
        .get('/api/icon')
        .end((err, res) => {
          if (err) {
            return next({
              type: actionTypes.GET_ALL_ICONS_ERROR,
              err
            })

          }
          const data = JSON.parse(res.text)
          console.log(data)
          return next({
            type: actionTypes.GET_ALL_ICONS_RECEIVED,
            data
          })
        })
      break

    default:
      break
  }

}

export default dataService
