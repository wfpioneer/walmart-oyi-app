/* eslint-disable no-shadow */
import {
  call, put, select, takeLatest
} from 'redux-saga/effects';
import _ from 'lodash';
import { AxiosError } from 'axios';
import { GenericActionTypes } from '../../actions/generic/makeAsyncActions';
import { AsyncSelector, asyncSelector } from '../../reducers/AsyncSelectors';

export function makeAsyncSaga<Q = any, R = any, E = AxiosError>(
  INITIATOR: string,
  opActions: GenericActionTypes<Q, R>,
  service: (payload: Q) => Promise<R>,
  selector: AsyncSelector<Q, R, E> = asyncSelector,
  handleError = _.noop
) {
  function* worker(initiationAction: { type: string; payload: Q }) {
    const { payload } = initiationAction;
    const initiator = opActions.START(payload).type;
    const initiatesUsingOpAction = INITIATOR === initiator;

    if (!initiatesUsingOpAction) {
      // If we decide to remove saga actions, then this put goes away
      yield put(opActions.START(payload));
    }

    try {
      // @ts-expect-error expression implicitly results in an 'any' type because its containing generator lacks a return-type annotation.
      const serviceResult = yield call<(payload: Q) => Promise<R>>(
        service, payload);

      yield put(opActions.SUCCEED(serviceResult));

      return serviceResult;
    } catch (error: any) {
      yield put(opActions.FAIL(error));
      yield call(handleError, error);

      return null;
    } finally {
      yield put(opActions.COMPLETE(yield select(selector)));
    }
  }

  function* watcher() {
    yield takeLatest(INITIATOR, worker);
  }

  return watcher;
}
