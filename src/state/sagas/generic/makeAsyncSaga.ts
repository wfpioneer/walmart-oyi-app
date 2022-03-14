/* eslint-disable no-shadow */
import {
  call, put, select, takeLatest
} from 'redux-saga/effects';
import _ from 'lodash';
import { AxiosError, AxiosResponse } from 'axios';
import { GenericActionTypes } from '../../actions/generic/makeAsyncActions';
import { AsyncSelector, asyncSelector } from '../../reducers/AsyncSelectors';
import { trackEvent } from '../../../utils/AppCenterTool';
import moment from 'moment';

export function makeAsyncSaga<Q = any, R = AxiosResponse, E = AxiosError>(
  INITIATOR: string,
  opActions: GenericActionTypes<Q, R>,
  service: (payload: any) => Promise<R>, 
  selector: AsyncSelector<Q, R, E> = asyncSelector,
  handleError = _.noop
) { // Set payload to type "any" because a generic type parameter (Q = any) is recognized as type "never" allowing no params to be passed
  function* worker(initiationAction: { type: string; payload: any }) {
    const { payload, type } = initiationAction;
    const initiator = opActions.START(payload).type;
    const initiatesUsingOpAction = INITIATOR === initiator;
    // Removes SAGA from saga action type
    const eventName = type.slice(5);
    /* Tracks the request payload data that is sent from saga.ts Actions.
       New payload data should be added here for tracking if they don't already exist
    */
    const eventParams = {
      apiName: eventName,
      itemNbr: payload?.itemNbr || payload?.id,
      duration: payload?.duration,
      itemDetails: JSON.stringify(payload?.itemDetails),
      upc: payload?.upc,
      zoneId: payload?.zoneId,
      aisleId: payload?.aisleId,
      sectionId: payload?.sectionId,
      locationTypeNbr: payload?.locationTypeNbr,
      approvalAction: payload?.headers?.action,
      scannedValue: payload?.scannedValue,
      status: payload?.status,
      onHandsItem: JSON.stringify(payload?.data),
      printQueue: JSON.stringify(payload?.printList),
      locationId: payload?.locationId,
      palletId: payload?.palletId,
      palletIds: JSON.stringify(payload?.palletIds)
    };
    const apiStart = moment().valueOf();
    if (!initiatesUsingOpAction) {
      // If we decide to remove saga actions, then this put goes away
      trackEvent('API_START', eventParams);
      yield put(opActions.START(payload));
    }

    try {
      // @ts-expect-error expression implicitly results in an 'any' type because its containing generator lacks a return-type annotation.
      const serviceResult = yield call<(payload: Q) => Promise<R>>(service, payload);
      // Track Successful api Requests
      const duration = moment().valueOf() - apiStart;
      let getFluffyResult;
      if (eventName.includes('FLUFFY')) {
        getFluffyResult = serviceResult.data;
      }
      trackEvent('API_SUCCESS', {
        ...eventParams, duration, statusCode: serviceResult.status, fluffyRoles: JSON.stringify(getFluffyResult)
      });

      yield put(opActions.SUCCEED(serviceResult));

      return serviceResult;
    } catch (error: any) {
      // Track Failed api Requests
      const duration = moment().valueOf() - apiStart;
      trackEvent('API_FAIL', { ...eventParams, duration, errorDetails: error.message || JSON.stringify(error) });

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
