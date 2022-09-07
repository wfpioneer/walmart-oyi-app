/* eslint-disable no-shadow */
import {
  call, put, select, takeLatest
} from 'redux-saga/effects';
import noop from 'lodash/noop';
import { AxiosError, AxiosResponse } from 'axios';
import moment from 'moment';
import { GenericActionTypes } from '../../actions/generic/makeAsyncActions';
import { AsyncSelector, asyncSelector } from '../../reducers/AsyncSelectors';
import { trackEvent } from '../../../utils/AppCenterTool';
import { SagaParams } from '../../actions/saga';

export function makeAsyncSaga<Q = any, R = AxiosResponse, E = AxiosError>(
  INITIATOR: string,
  opActions: GenericActionTypes<Q, R>,
  service: (payload: any) => Promise<R>,
  selector: AsyncSelector<Q, R, E> = asyncSelector,
  handleError = noop
) {
  /* Set payload to type "any" because a generic type parameter (Q = any)
        is recognized as type "never" allowing no params to be passed */
  function* worker(initiationAction: { type: string; payload: SagaParams['payload'] }) {
    const { payload, type } = initiationAction;
    // @ts-expect-error "payload: Q" assumes "Q" can be instantiated with a type other than "payload"
    const initiator = opActions.START(payload).type;
    const initiatesUsingOpAction = INITIATOR === initiator;
    // Removes SAGA from saga action type
    const eventName = type.slice(5);
    /* Tracks the request payload data that is sent from saga.ts Actions.
       New payload data should be added here for tracking if they don't already exist
    */

    const eventParams = {
      apiName: eventName,
      id: payload?.id,
      itemNbr: payload?.itemNbr || payload?.itemNumber,
      description: payload?.itemDesc || payload?.description,
      upc: payload?.upc || payload?.upcNbr,
      zoneId: payload?.zoneId,
      aisleId: payload?.aisleId,
      sectionId: payload?.sectionId,
      locationTypeNbr: payload?.locationTypeNbr,
      // @ts-expect-error "action" only exists on one header causing type never error
      approvalAction: payload?.headers?.action,
      scannedValue: payload?.scannedValue,
      status: payload?.status,
      onHandsItem: JSON.stringify(payload?.data),
      printQueue: JSON.stringify(payload?.printList),
      locationId: payload?.locationId || payload?.salesFloorLocationId,
      palletId: payload?.palletId,
      palletIds: JSON.stringify(payload?.palletIds),
      combinePallets: JSON.stringify(payload?.combinePallets),
      aisles: JSON.stringify(payload?.aisles),
      targetPallet: payload?.targetPallet,
      approvalItems: JSON.stringify(payload?.approvalItems),
      categoryNbr: payload?.category,
      expirationDate: payload?.expirationDate,
      items: JSON.stringify(payload?.items),
      location: payload?.location,
      newLocationTypeNbr: payload?.newLocationTypeNbr,
      newSectionId: payload?.newSectionId,
      numberOfPallets: payload?.numberOfPallets,
      palletItem: payload?.palletItem,
      picklistIds: JSON.stringify(payload?.picklistIds),
      picklistItems: JSON.stringify(payload?.picklistItems),
      printList: JSON.stringify(payload?.printList),
      printLabelList: JSON.stringify(payload?.printLabelList),
      printPalletList: JSON.stringify(payload?.printPalletList),
      upcs: JSON.stringify(payload?.upcs),
      worklistType: JSON.stringify(payload?.worklistType),
      zoneName: payload?.zoneName,
      approvalRequestSource: payload?.approvalRequestSource,
      getExcludeHistory: payload?.getExcludeHistory,
      getMetadataHistory: payload?.getMetadataHistory,
      getSummary: payload?.getSummary,
      isAllItems: payload?.isAllItems,
      isSummary: payload?.isSummary,
      locationName: payload?.locationName || payload?.salesFloorLocationName,
      moveToFront: payload?.moveToFront,
      palletExpiration: payload?.palletExpiration
    };
    const apiStart = moment().valueOf();
    if (!initiatesUsingOpAction) {
      // If we decide to remove saga actions, then this put goes away
      trackEvent('API_START', eventParams);
      // @ts-expect-error "payload: Q" assumes "Q" can be instantiated with a type other than "payload"
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

  return { watcher, worker };
}
