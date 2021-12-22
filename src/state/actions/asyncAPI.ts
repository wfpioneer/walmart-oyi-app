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

export const UPDATE_APPROVAL_LIST = makeAsyncActionTypes('API/UPDATE_APPROVAL_LIST');
export const updateApprovalList = makeAsyncActionCreators(UPDATE_APPROVAL_LIST);

export const GET_ALL_ZONES = makeAsyncActionTypes('API/GET_ALL_ZONES');
export const getAllZones = makeAsyncActionCreators(GET_ALL_ZONES);

export const GET_AISLE = makeAsyncActionTypes('API/GET_AISLE');
export const getAisle = makeAsyncActionCreators(GET_AISLE);

export const GET_SECTIONS = makeAsyncActionTypes('API/GET_SECTIONS');
export const getSections = makeAsyncActionCreators(GET_SECTIONS);

export const GET_SECTION_DETAILS = makeAsyncActionTypes('API/GET_SECTION_DETAILS');
export const getSectionDetails = makeAsyncActionCreators(GET_SECTION_DETAILS);

export const PRINT_LOCATION_LABELS = makeAsyncActionTypes('API/PRINT_LOCATION_LABELS');
export const printLocationLabels = makeAsyncActionCreators(PRINT_LOCATION_LABELS);

export const ADD_PALLET = makeAsyncActionTypes('API/ADD_PALLET');
export const addPallet = makeAsyncActionCreators(ADD_PALLET);

export const DELETE_PALLET = makeAsyncActionTypes('API/DELETE_PALLET');
export const deletePallet = makeAsyncActionCreators(DELETE_PALLET);

export const GET_PALLET_DETAILS = makeAsyncActionTypes('API/GET_PALLET_DETAILS');
export const getPalletDetails = makeAsyncActionCreators(GET_PALLET_DETAILS);

export const POST_CREATE_AISLES = makeAsyncActionTypes('API/POST_CREATE_AISLES');
export const postCreateAisles = makeAsyncActionCreators(POST_CREATE_AISLES);

export const CREATE_SECTIONS = makeAsyncActionTypes('API/CREATE_SECTIONS');
export const createSections = makeAsyncActionCreators(CREATE_SECTIONS);

export const CREATE_ZONE = makeAsyncActionTypes('API/CREATE_ZONE');
export const createZone = makeAsyncActionCreators(CREATE_ZONE);
export const DELETE_ZONE = makeAsyncActionTypes('API/DELETE_ZONE');
export const deleteZone = makeAsyncActionCreators(DELETE_ZONE);
