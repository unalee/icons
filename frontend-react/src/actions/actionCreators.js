import * as actionTypes from './actionTypes'

export function getAllIcons({tag, author, limit, skip}) {
  return {
    type: actionTypes.GET_ALL_ICONS,
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
