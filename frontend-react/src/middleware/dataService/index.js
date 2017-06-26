import request  from 'superagent'
import * as actionTypes from '../../actions/actionTypes'

const dataService = store => next => action => {
  next(action)
  switch (action.type) {
    case actionTypes.GET_ICONS:
      const { limit, skip, tag, userId } = action;
      request
        .get('/api/icon')
        .query({limit})
        .query({skip})
        .query({userId})
        .query({tag})
        .end((err, res) => {
          if (err) {
            return next({
              type: actionTypes.GET_ICONS_ERROR,
              err
            })

          }

          const data = JSON.parse(res.text)
          console.log(store, data)

          return next({
            type: actionTypes.GET_ICONS_RECEIVED,
            data
          })
        })
      break


      case actionTypes.GET_ICONS_RECEIVED:
        console.log(store, action.data);
        break;
    default:
      break
  }

}

export default dataService
