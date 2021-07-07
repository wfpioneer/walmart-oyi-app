import {
  ApprovalListItem, approvalAction, approvalRequestSource, approvalStatus
} from '../../models/ApprovalListItem';

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
export const GET_FLUFFY_FEATURES = 'SAGA/GET_FLUFFY_FEATURES';
export const GET_APPROVAL_LIST = 'SAGA/GET_APPROVAL_LIST';
export const UPDATE_APPROVAL_LIST = 'SAGA/UPDATE_APPROVAL_LIST';
export const GET_ALL_ZONES = 'SAGA/GET_ZONES';

// TODO add types for each service payload
export const hitGoogle = (payload: any) => ({ type: HIT_GOOGLE, payload } as const);
export const getItemDetails = (payload: any) => ({ type: GET_ITEM_DETAILS, payload } as const);
export const getWorklist = (payload?: any) => ({ type: GET_WORKLIST, payload } as const);
export const editLocation = (payload: any) => ({ type: EDIT_LOCATION, payload } as const);
export const addLocation = (payload: any) => ({ type: ADD_LOCATION, payload } as const);
export const updateOHQty = (payload: { data: Partial<ApprovalListItem>}) => ({ type: UPDATE_OH_QTY, payload } as const);
export const addToPicklist = (payload: any) => ({ type: ADD_TO_PICKLIST, payload } as const);
export const getWorklistSummary = (payload: any) => ({ type: GET_WORKLIST_SUMMARY, payload } as const);
export const deleteLocation = (payload: any) => ({ type: DELETE_LOCATION, payload } as const);
export const noAction = (payload: any) => ({ type: NO_ACTION, payload } as const);
export const printSign = (payload: any) => ({ type: PRINT_SIGN, payload } as const);
export const getLocationDetails = (payload: any) => ({ type: GET_LOCATION_DETAILS, payload } as const);
export const getFluffyFeatures = (payload: any) => ({ type: GET_FLUFFY_FEATURES, payload } as const);
export const getApprovalList = (payload: {
  itemNbr?: number;
  status?: approvalStatus;
  approvalRequestSource?: approvalRequestSource;
}) => ({ type: GET_APPROVAL_LIST, payload } as const);
export const updateApprovalList = (payload: {
  approvalItems: ApprovalListItem[]
  headers: {action: approvalAction},
}) => ({ type: UPDATE_APPROVAL_LIST, payload } as const);
export const getAllZones = (payload: any) => ({ type: GET_ALL_ZONES, payload });
