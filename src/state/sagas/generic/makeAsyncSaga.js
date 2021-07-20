import {
  call, put, takeLatest
} from 'redux-saga/effects';
import _ from 'lodash';
import moment from 'moment';
import { trackEvent } from '../../../utils/AppCenterTool';

export function makeAsyncSaga(INITIATOR, opActions, service, handleError = _.noop) {
  const initiatesUsingOpAction = INITIATOR === opActions.start().type;

  function* worker(initiationAction = {}) {
    const { payload, type } = initiationAction;
    const eventName = type.slice(5);
    const eventParams = {
      apiName: eventName,
      itemNbr: payload?.itemNbr || payload?.id,
      duration: payload?.duration,
      itemDetails: JSON.stringify(payload?.itemDetails),
      upc: payload?.upc,
      sectionId: payload?.sectionId,
      locationTypeNbr: payload?.locationTypeNbr,
      approvalAction: payload?.headers?.action,
      scannedValue: payload?.scannedValue,
      status: payload?.status,
      onHandsItem: JSON.stringify(payload?.data)
    };
    const apiStart = moment().valueOf();
    if (!initiatesUsingOpAction) {
      // If we decide to remove saga actions, then this put goes away

      trackEvent('API_START', eventParams);
      yield put(opActions.start(payload));
    }

    try {
      const serviceResult = yield call(service, payload);
      const duration = moment().valueOf() - apiStart;

      trackEvent('API_SUCCESS', { ...eventParams, duration, statusCode: serviceResult.status });
      yield put(opActions.succeed(serviceResult));

      return serviceResult;
    } catch (error) {
      const duration = moment().valueOf() - apiStart;

      trackEvent('API_FAIL', { ...eventParams, duration, errorDetails: error.message || JSON.stringify(error) });
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
