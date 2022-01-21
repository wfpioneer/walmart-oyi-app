import { combineReducers } from 'redux';
import { makeAsyncReducer } from './generic/makeAsyncReducer';
import * as asyncActions from '../actions/asyncAPI';

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
  getAllZones: makeAsyncReducer(asyncActions.GET_ALL_ZONES),
  getAisle: makeAsyncReducer(asyncActions.GET_AISLE),
  getSections: makeAsyncReducer(asyncActions.GET_SECTIONS),
  getSectionDetails: makeAsyncReducer(asyncActions.GET_SECTION_DETAILS),
  addPallet: makeAsyncReducer(asyncActions.ADD_PALLET),
  deletePallet: makeAsyncReducer(asyncActions.DELETE_PALLET),
  printLocationLabels: makeAsyncReducer(asyncActions.PRINT_LOCATION_LABELS),
  getPalletDetails: makeAsyncReducer(asyncActions.GET_PALLET_DETAILS),
  postCreateAisles: makeAsyncReducer(asyncActions.POST_CREATE_AISLES),
  createSections: makeAsyncReducer(asyncActions.CREATE_SECTIONS),
  postCreateZone: makeAsyncReducer(asyncActions.CREATE_ZONE),
  deleteZone: makeAsyncReducer(asyncActions.DELETE_ZONE),
  clearLocation: makeAsyncReducer(asyncActions.CLEAR_LOCATION),
  deleteAisle: makeAsyncReducer(asyncActions.DELETE_AISLE),
  removeSection: makeAsyncReducer(asyncActions.REMOVE_SECTION),
  getZoneNames: makeAsyncReducer(asyncActions.GET_ZONE_NAMES),
  getClubConfig: makeAsyncReducer(asyncActions.GET_CLUB_CONFIG),
  getItemDetailsUPC: makeAsyncReducer(asyncActions.GET_ITEM_DETAIL_UPC)
});

export default asyncReducer;
