import {
  call, put, takeLatest
} from 'redux-saga/effects';
import _ from 'lodash';
import { trackEvent } from '../../../utils/AppCenterTool';

export function makeAsyncSaga(INITIATOR, opActions, service, handleError = _.noop) {
  const initiatesUsingOpAction = INITIATOR === opActions.start().type;

  function* worker(initiationAction = {}) {
    const { payload, type } = initiationAction;
    const eventName = type.slice(5);
    const eventParams = {
      apiName: eventName,
      barcode: payload?.id,
      itemNbr: payload?.itemNbr,
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
    if (!initiatesUsingOpAction) {
      // If we decide to remove saga actions, then this put goes away

      trackEvent('API_START', eventParams);
      yield put(opActions.start(payload));
    }

    try {
      const serviceResult = yield call(service, payload);

      trackEvent('API_SUCCESS', { ...eventParams, statusCode: serviceResult.status });
      yield put(opActions.succeed(serviceResult));

      return serviceResult;
    } catch (error) {
      trackEvent('API_FAIL', { ...eventParams, errorDetails: error.message || JSON.stringify(error) });
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
