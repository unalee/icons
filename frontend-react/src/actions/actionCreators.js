import * as actionTypes from './actionTypes'

export function getIcons({tag, author, limit, skip}) {
  return {
    type: actionTypes.GET_ICONS,
    date: Date.now(),
    author,
    tag,
    limit,
    skip

  }
}

export function getIconWithId(iconId) {
  return {
    type: actionTypes.GET_ICON,
    date: Date.now(),
    iconId
  }
}

export function logIn({email, password}) {
  return {
    type: actionTypes.LOGIN,
    date: Date.now(),
    email,
    password
  }
}

export function logOut() {
  return {
    type: actionTypes.LOGOUT,
    date: Date.now()
  }
}

export function signUp({username, password}) {
  return {
    type: actionTypes.CREATE_ACCOUNT,
    date: Date.now(),
    username,
    password
  }
}

export function checkToken() {
  const token = localStorage.getItem('icons.x-access-token');
  return {
    type: actionTypes.CHECK_TOKEN,
    date: Date.now(),
    token
  }
}
