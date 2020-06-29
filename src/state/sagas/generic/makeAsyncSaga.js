import {
  call, put, takeLatest
} from 'redux-saga/effects';
import _ from 'lodash';

export function makeAsyncSaga(INITIATOR, opActions, service, handleError = _.noop) {
  const initiatesUsingOpAction = INITIATOR === opActions.start().type;

  function* worker(initiationAction = {}) {
    const { payload } = initiationAction;

    if (!initiatesUsingOpAction) {
      // If we decide to remove saga actions, then this put goes away
      yield put(opActions.start(payload));
    }

    try {
      const serviceResult = yield call(service, payload);

      yield put(opActions.succeed(serviceResult));

      return serviceResult;
    } catch (error) {
      yield put(opActions.fail(error));
      yield call(handleError, error);

      return null;
    }
  }

  function* watcher() {
    yield takeLatest(INITIATOR, worker);
  }

  return watcher;
}
