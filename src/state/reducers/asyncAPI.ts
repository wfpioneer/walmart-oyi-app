import { combineReducers } from 'redux';
import { makeAsyncReducer } from './generic/makeAsyncReducer';
import * as asyncActions from '../actions/asyncAPI';

export const asyncReducer = combineReducers({
  // TODO remove this reducer once the BE orchestration changes have been pushed to production
  getItemDetailsV2: makeAsyncReducer(asyncActions.GET_ITEM_DETAILS_V2),
  hitGoogle: makeAsyncReducer(asyncActions.HIT_GOOGLE),
  getItemDetails: makeAsyncReducer(asyncActions.GET_ITEM_DETAILS),
  getWorklist: makeAsyncReducer(asyncActions.GET_WORKLIST),
  getWorklistAudits: makeAsyncReducer(asyncActions.GET_WORKLIST_AUDIT),
  getPalletWorklist: makeAsyncReducer(asyncActions.GET_PALLET_WORKLIST),
  editLocation: makeAsyncReducer(asyncActions.EDIT_LOCATION),
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
  postCreateAisles: makeAsyncReducer(asyncActions.POST_CREATE_AISLES),
  createSections: makeAsyncReducer(asyncActions.CREATE_SECTIONS),
  postCreateZone: makeAsyncReducer(asyncActions.CREATE_ZONE),
  deleteZone: makeAsyncReducer(asyncActions.DELETE_ZONE),
  clearLocation: makeAsyncReducer(asyncActions.CLEAR_LOCATION),
  deleteAisle: makeAsyncReducer(asyncActions.DELETE_AISLE),
  removeSection: makeAsyncReducer(asyncActions.REMOVE_SECTION),
  getZoneNames: makeAsyncReducer(asyncActions.GET_ZONE_NAMES),
  getClubConfig: makeAsyncReducer(asyncActions.GET_CLUB_CONFIG),
  getItemDetailsUPC: makeAsyncReducer(asyncActions.GET_ITEM_DETAIL_UPC),
  addPalletUPCs: makeAsyncReducer(asyncActions.ADD_PALLET_UPCS),
  updatePalletItemQty: makeAsyncReducer(asyncActions.UPDATE_PALLET_ITEM_QTY),
  deleteUpcs: makeAsyncReducer(asyncActions.DELETE_UPCS),
  combinePallets: makeAsyncReducer(asyncActions.COMBINE_PALLETS),
  printPalletLabel: makeAsyncReducer(asyncActions.PRINT_PALLET_LABEL),
  clearPallet: makeAsyncReducer(asyncActions.CLEAR_PALLET),
  getPalletDetails: makeAsyncReducer(asyncActions.GET_PALLET_DETAILS),
  binPallets: makeAsyncReducer(asyncActions.POST_BIN_PALLETS),
  getPalletConfig: makeAsyncReducer(asyncActions.GET_PALLET_CONFIG),
  postCreatePallet: makeAsyncReducer(asyncActions.POST_CREATE_PALLET),
  updatePicklistStatus: makeAsyncReducer(asyncActions.UPDATE_PICKLIST_STATUS),
  getPicklists: makeAsyncReducer(asyncActions.GET_PICKLISTS),
  updatePalletNotFound: makeAsyncReducer(asyncActions.UPDATE_PALLET_NOT_FOUND),
  createNewPick: makeAsyncReducer(asyncActions.CREATE_NEW_PICK),
  reportMissingPallet: makeAsyncReducer(asyncActions.REPORT_MISSING_PALLET),
  getItemPallets: makeAsyncReducer(asyncActions.GET_ITEM_PALLETS),
  updateMultiPalletUPCQty: makeAsyncReducer(asyncActions.UPDATE_MULTI_PALLET_UPC_QTY),
  submitFeedbackRating: makeAsyncReducer(asyncActions.SUBMIT_FEEDBACK_RATING),
  getUserConfig: makeAsyncReducer(asyncActions.GET_USER_CONFIG),
  updateUserConfig: makeAsyncReducer(asyncActions.UPDATE_USER_CONFIG)
});

export default asyncReducer;
