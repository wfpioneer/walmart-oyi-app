import { makeAsyncActionCreators, makeAsyncActionTypes } from './generic/makeAsyncActions';

export const HIT_GOOGLE = makeAsyncActionTypes('API/HIT_GOOGLE');
export const hitGoogle = makeAsyncActionCreators(HIT_GOOGLE);

export const GET_ITEM_DETAILS = makeAsyncActionTypes('API/GET_ITEM_DETAILS');
export const getItemDetails = makeAsyncActionCreators(GET_ITEM_DETAILS);

export const GET_WORKLIST = makeAsyncActionTypes('API/GET_WORKLIST');
export const getWorklist = makeAsyncActionCreators(GET_WORKLIST);

export const UPDATE_OH_QTY = makeAsyncActionTypes('API/UPDATE_OH_QTY');
export const updateOHQty = makeAsyncActionCreators(UPDATE_OH_QTY);

export const EDIT_LOCATION = makeAsyncActionTypes('API/EDIT_LOCATION');
export const editLocation = makeAsyncActionCreators(EDIT_LOCATION);

export const ADD_LOCATION = makeAsyncActionTypes('API/ADD_LOCATION');
export const addLocation = makeAsyncActionCreators(ADD_LOCATION);

export const ADD_TO_PICKLIST = makeAsyncActionTypes('API/ADD_TO_PICKLIST');
export const addToPicklist = makeAsyncActionCreators(ADD_TO_PICKLIST);

export const GET_WORKLIST_SUMMARY = makeAsyncActionTypes('API/GET_WORKLIST_SUMMARY');
export const getWorklistSummary = makeAsyncActionCreators(GET_WORKLIST_SUMMARY);

export const DELETE_LOCATION = makeAsyncActionTypes('API/DELETE_LOCATION');
export const deleteLocation = makeAsyncActionCreators(DELETE_LOCATION);

export const NO_ACTION = makeAsyncActionTypes('API/NO_ACTION');
export const noAction = makeAsyncActionCreators(NO_ACTION);

export const PRINT_SIGN = makeAsyncActionTypes('API/PRINT_SIGN');
export const printSign = makeAsyncActionCreators(PRINT_SIGN);

export const GET_LOCATION_DETAILS = makeAsyncActionTypes('API/GET_LOCATION_DETAILS');
export const getLocationDetails = makeAsyncActionCreators(GET_LOCATION_DETAILS);

export const GET_FLUFFY_ROLES = makeAsyncActionTypes('API/GET_FLUFFY_ROLES');
export const getFluffyRoles = makeAsyncActionCreators(GET_FLUFFY_ROLES);

export const GET_APPROVAL_LIST = makeAsyncActionTypes('API/GET_APPROVAL_LIST');
export const getApprovalList = makeAsyncActionCreators(GET_APPROVAL_LIST);
