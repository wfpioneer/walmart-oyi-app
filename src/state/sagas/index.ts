import { all, call } from 'redux-saga/effects';
import { makeAsyncSaga } from './generic/makeAsyncSaga';
import * as saga from '../actions/saga';
import * as actions from '../actions/asyncAPI';
import HitGoogleService from '../../services/HitGoogle.service';
import GetItemDetailsService from '../../services/GetItemDetails.service';
import GetWorklistService from '../../services/GetWorklist.service';
import EditLocationService from '../../services/EditLocation.service';
import UpdateOHQtyService from '../../services/UpdateOHQty.service';
import AddToPicklistService from '../../services/AddToPicklist.service';
import AddLocationService from '../../services/AddLocation.service';
import WorklistSummaryService from '../../services/WorklistSummary.service';
import DeleteLocationService from '../../services/DeleteLocation.service';
import NoActionService from '../../services/NoAction.service';
import PrintService from '../../services/Print.service';

const genericSagas = [
  makeAsyncSaga(saga.HIT_GOOGLE, actions.hitGoogle, HitGoogleService.hitGoogle),
  makeAsyncSaga(saga.GET_ITEM_DETAILS, actions.getItemDetails, GetItemDetailsService.getItemDetails),
  makeAsyncSaga(saga.GET_WORKLIST, actions.getWorklist, GetWorklistService.getWorklist),
  makeAsyncSaga(saga.EDIT_LOCATION, actions.editLocation, EditLocationService.editLocation),
  makeAsyncSaga(saga.ADD_TO_PICKLIST, actions.addToPicklist, AddToPicklistService.addToPicklist),
  makeAsyncSaga(saga.ADD_LOCATION, actions.addLocation, AddLocationService.addLocation),
  makeAsyncSaga(saga.UPDATE_OH_QTY, actions.updateOHQty, UpdateOHQtyService.updateOHQty),
  makeAsyncSaga(saga.GET_WORKLIST_SUMMARY, actions.getWorklistSummary, WorklistSummaryService.getWorklistSummary),
  makeAsyncSaga(saga.DELETE_LOCATION, actions.deleteLocation, DeleteLocationService.deleteLocation),
  makeAsyncSaga(saga.NO_ACTION, actions.noAction, NoActionService.noAction),
  makeAsyncSaga(saga.PRINT_SIGN, actions.printSign, PrintService.print)
];

export default function* rootSaga() {
  // @ts-ignore
  yield all(genericSagas.map(genericSaga => call(genericSaga)));
}
