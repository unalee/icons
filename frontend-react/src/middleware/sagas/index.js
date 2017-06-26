import { put, takeEvery, all } from 'redux-saga/effects'

export function* helloSaga() {
  console.log('Hello Sagas!')
}