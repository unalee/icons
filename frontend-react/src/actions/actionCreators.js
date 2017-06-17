import * as actionTypes from './actionTypes'

export function getAllIcons({tag, author}) {
  return {
    type: actionTypes.GET_ALL_ICONS,
    date: Date.now(),
    author,
    tag

  }
}

export function getIconWithId(iconId) {
  return {
    type: actionTypes.GET_ICON,
    date: Date.now(),
    iconId
  }
}
