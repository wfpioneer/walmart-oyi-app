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
import GetLocationDetailsService from '../../services/GetLocationDetails.service';
import GetFluffyRolesService from '../../services/GetFluffyRoles.service';
import GetApprovalListService from '../../services/GetApprovalList.service';
import UpdateApprovalListService from '../../services/UpdateApprovalList.service';

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
  makeAsyncSaga(saga.PRINT_SIGN, actions.printSign, PrintService.print),
  makeAsyncSaga(saga.GET_LOCATION_DETAILS, actions.getLocationDetails, GetLocationDetailsService.getLocation),
  makeAsyncSaga(saga.GET_FLUFFY_FEATURES, actions.getFluffyRoles, GetFluffyRolesService.getFluffyRoles),
  makeAsyncSaga(saga.GET_APPROVAL_LIST, actions.getApprovalList, GetApprovalListService.getApprovalList),
  makeAsyncSaga(saga.UPDATE_APPROVAL_LIST, actions.updateApprovalList, UpdateApprovalListService.updateApprovalList),
  makeAsyncSaga(saga.GET_LOCATION_DETAILS, actions.getLocationDetails, GetLocationDetailsService.getLocation)
];

export default function* rootSaga() {
  yield all(genericSagas.map(genericSaga => call(genericSaga)));
}
