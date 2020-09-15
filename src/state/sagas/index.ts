import { all, call } from 'redux-saga/effects';
import { makeAsyncSaga } from './generic/makeAsyncSaga';
import * as saga from '../actions/saga';
import * as actions from '../actions/asyncAPI';
import HitGoogleService from '../../services/HitGoogle.service';
import GetItemDetailsService from '../../services/GetItemDetails.service';
import GetWorklistService from "../../services/GetWorklist.service";
import EditLocationService from "../../services/EditLocation.service";
import AddToPicklistService from '../../services/AddToPicklist.service';

const genericSagas = [
  makeAsyncSaga(saga.HIT_GOOGLE, actions.hitGoogle, HitGoogleService.hitGoogle),
  makeAsyncSaga(saga.GET_ITEM_DETAILS, actions.getItemDetails, GetItemDetailsService.getItemDetails),
  makeAsyncSaga(saga.GET_WORKLIST, actions.getWorklist, GetWorklistService.getWorklist),
  makeAsyncSaga(saga.EDIT_LOCATION, actions.editLocation, EditLocationService.editLocation),
  makeAsyncSaga(saga.ADD_TO_PICKLIST, actions.addToPicklist, AddToPicklistService.addToPicklist)
];

export default function* rootSaga() {
  // @ts-ignore
  yield all(genericSagas.map(genericSaga => call(genericSaga)));
}
