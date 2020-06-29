import { all, call } from 'redux-saga/effects';
import { makeAsyncSaga } from './generic/makeAsyncSaga';
import * as saga from '../actions/saga';
import * as actions from '../actions/asyncAPI';
import HitGoogleService from '../../services/HitGoogle.service';

const genericSagas = [
  makeAsyncSaga(saga.HIT_GOOGLE, actions.hitGoogle, HitGoogleService.hitGoogle)
];

export default function* rootSaga() {
  // @ts-ignore
  yield all(genericSagas.map(genericSaga => call(genericSaga)));
}
