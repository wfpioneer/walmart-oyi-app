import { approvalRequestSource, approvalStatus } from '../../models/ApprovalListItem';

export const HIT_GOOGLE = 'SAGA/HIT_GOOGLE';
export const GET_ITEM_DETAILS = 'SAGA/GET_ITEM_DETAILS';
export const GET_WORKLIST = 'SAGA/GET_WORKLIST';
export const EDIT_LOCATION = 'SAGA/EDIT_LOCATION';
export const UPDATE_OH_QTY = 'SAGA/UPDATE_OH_QTY';
export const ADD_TO_PICKLIST = 'SAGA/ADD_TO_PICKLIST';
export const ADD_LOCATION = 'SAGA/ADD_LOCATION';
export const GET_WORKLIST_SUMMARY = 'SAGA/GET_WORKLIST_SUMMARY';
export const DELETE_LOCATION = 'SAGA/DELETE_LOCATION';
export const NO_ACTION = 'SAGA/NO_ACTION';
export const PRINT_SIGN = 'SAGA/PRINT_SIGN';
export const GET_LOCATION_DETAILS = 'SAGA/GET_LOCATION_DETAILS';
export const GET_FLUFFY_ROLES = 'SAGA/GET_FLUFFY_ROLES';
export const GET_APPROVAL_LIST = 'SAGA/GET_APPROVAL_LIST';

// TODO add types for each service payload
export const hitGoogle = (payload: any) => ({ type: HIT_GOOGLE, payload });
export const getItemDetails = (payload: any) => ({ type: GET_ITEM_DETAILS, payload });
export const getWorklist = (payload?: any) => ({ type: GET_WORKLIST, payload });
export const editLocation = (payload: any) => ({ type: EDIT_LOCATION, payload });
export const addLocation = (payload: any) => ({ type: ADD_LOCATION, payload });
export const updateOHQty = (payload: any) => ({ type: UPDATE_OH_QTY, payload });
export const addToPicklist = (payload: any) => ({ type: ADD_TO_PICKLIST, payload });
export const getWorklistSummary = (payload: any) => ({ type: GET_WORKLIST_SUMMARY, payload });
export const deleteLocation = (payload: any) => ({ type: DELETE_LOCATION, payload });
export const noAction = (payload: any) => ({ type: NO_ACTION, payload });
export const printSign = (payload: any) => ({ type: PRINT_SIGN, payload });
export const getLocationDetails = (payload: any) => ({ type: GET_LOCATION_DETAILS, payload });
export const getFluffyRoles = (payload: any) => ({ type: GET_FLUFFY_ROLES, payload });
export const getApprovalList = (payload: {
  itemNbr?: number;
  status?: approvalStatus;
  approvalRequestSource?: approvalRequestSource;
}) => ({ type: GET_APPROVAL_LIST, payload });
