import { combineReducers } from 'redux';
import { makeAsyncReducer } from './generic/makeAsyncReducer';
import * as asyncActions from '../actions/asyncAPI';
import { getZones } from '../actions/saga';

// @ts-ignore
export const asyncReducer = combineReducers({
  hitGoogle: makeAsyncReducer(asyncActions.HIT_GOOGLE),
  getItemDetails: makeAsyncReducer(asyncActions.GET_ITEM_DETAILS),
  getWorklist: makeAsyncReducer(asyncActions.GET_WORKLIST),
  editLocation: makeAsyncReducer(asyncActions.EDIT_LOCATION),
  addToPicklist: makeAsyncReducer(asyncActions.ADD_TO_PICKLIST),
  addLocation: makeAsyncReducer(asyncActions.ADD_LOCATION),
  updateOHQty: makeAsyncReducer(asyncActions.UPDATE_OH_QTY),
  getWorklistSummary: makeAsyncReducer(asyncActions.GET_WORKLIST_SUMMARY),
  deleteLocation: makeAsyncReducer(asyncActions.DELETE_LOCATION),
  noAction: makeAsyncReducer(asyncActions.NO_ACTION),
  printSign: makeAsyncReducer(asyncActions.PRINT_SIGN),
  getLocation: makeAsyncReducer(asyncActions.GET_LOCATION_DETAILS),
  getFluffyRoles: makeAsyncReducer(asyncActions.GET_FLUFFY_ROLES),
  getApprovalList: makeAsyncReducer(asyncActions.GET_APPROVAL_LIST),
  updateApprovalList: makeAsyncReducer(asyncActions.UPDATE_APPROVAL_LIST),
  getZones: makeAsyncReducer(asyncActions.GET_ZONES)
});

export default asyncReducer;
