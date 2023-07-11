import { makeAsyncActionCreators, makeAsyncActionTypes } from './generic/makeAsyncActions';

export const GET_ITEM_DETAILS_V4 = makeAsyncActionTypes('API/GET_ITEM_DETAILS_V4');
export const getItemDetailsV4 = makeAsyncActionCreators(GET_ITEM_DETAILS_V4);

export const GET_ITEM_PIHISTORY = makeAsyncActionTypes('API/GET_ITEM_PIHISTORY');
export const getItemPiHistory = makeAsyncActionCreators(GET_ITEM_PIHISTORY);

export const GET_ITEM_PISALESHISTORY = makeAsyncActionTypes('API/GET_ITEM_PISALESHISTORY');
export const getItemPiSalesHistory = makeAsyncActionCreators(GET_ITEM_PISALESHISTORY);

export const GET_ITEM_PICKLISTHISTORY = makeAsyncActionTypes('API/GET_ITEM_PICKLISTHISTORY');
export const getItemPicklistHistory = makeAsyncActionCreators(GET_ITEM_PICKLISTHISTORY);

export const GET_LOCATIONS_FOR_ITEM = makeAsyncActionTypes('API/GET_LOCATIONS_FOR_ITEM');
export const getLocationsForItem = makeAsyncActionCreators(GET_LOCATIONS_FOR_ITEM);

export const GET_LOCATIONS_FOR_ITEM_V1 = makeAsyncActionTypes('API/GET_LOCATIONS_FOR_ITEM_V1');
export const getLocationsForItemV1 = makeAsyncActionCreators(GET_LOCATIONS_FOR_ITEM_V1);

export const GET_ITEM_MANAGERAPPROVALHISTORY = makeAsyncActionTypes('API/GET_ITEM_MANAGERAPPROVALHISTORY');
export const getItemManagerApprovalHistory = makeAsyncActionCreators(GET_ITEM_MANAGERAPPROVALHISTORY);

export const HIT_GOOGLE = makeAsyncActionTypes('API/HIT_GOOGLE');
export const hitGoogle = makeAsyncActionCreators(HIT_GOOGLE);

export const GET_WORKLIST = makeAsyncActionTypes('API/GET_WORKLIST');
export const getWorklist = makeAsyncActionCreators(GET_WORKLIST);

export const GET_WORKLIST_V1 = makeAsyncActionTypes('API/GET_WORKLIST_V1');
export const getWorklistV1 = makeAsyncActionCreators(GET_WORKLIST_V1);

export const GET_WORKLIST_AUDIT = makeAsyncActionTypes('API/GET_WORKLIST_AUDIT');
export const getWorklistAudit = makeAsyncActionCreators(GET_WORKLIST_AUDIT);

export const GET_PALLET_WORKLIST = makeAsyncActionTypes('API/GET_PALLET_WORKLIST');
export const getPalletWorklist = makeAsyncActionCreators(GET_PALLET_WORKLIST);

export const UPDATE_OH_QTY = makeAsyncActionTypes('API/UPDATE_OH_QTY');
export const updateOHQty = makeAsyncActionCreators(UPDATE_OH_QTY);

export const UPDATE_OH_QTY_V1 = makeAsyncActionTypes('API/UPDATE_OH_QTY_V1');
export const updateOHQtyV1 = makeAsyncActionCreators(UPDATE_OH_QTY_V1);

export const EDIT_LOCATION = makeAsyncActionTypes('API/EDIT_LOCATION');
export const editLocation = makeAsyncActionCreators(EDIT_LOCATION);

export const ADD_LOCATION = makeAsyncActionTypes('API/ADD_LOCATION');
export const addLocation = makeAsyncActionCreators(ADD_LOCATION);

export const GET_WORKLIST_SUMMARY = makeAsyncActionTypes('API/GET_WORKLIST_SUMMARY');
export const getWorklistSummary = makeAsyncActionCreators(GET_WORKLIST_SUMMARY);

export const GET_WORKLIST_SUMMARY_V2 = makeAsyncActionTypes('API/GET_WORKLIST_SUMMARY_V2');
export const getWorklistSummaryV2 = makeAsyncActionCreators(GET_WORKLIST_SUMMARY_V2);

export const DELETE_LOCATION = makeAsyncActionTypes('API/DELETE_LOCATION');
export const deleteLocation = makeAsyncActionCreators(DELETE_LOCATION);

export const NO_ACTION = makeAsyncActionTypes('API/NO_ACTION');
export const noAction = makeAsyncActionCreators(NO_ACTION);

export const PRINT_SIGN = makeAsyncActionTypes('API/PRINT_SIGN');
export const printSign = makeAsyncActionCreators(PRINT_SIGN);

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

export const POST_CREATE_AISLES = makeAsyncActionTypes('API/POST_CREATE_AISLES');
export const postCreateAisles = makeAsyncActionCreators(POST_CREATE_AISLES);

export const CREATE_SECTIONS = makeAsyncActionTypes('API/CREATE_SECTIONS');
export const createSections = makeAsyncActionCreators(CREATE_SECTIONS);

export const CREATE_ZONE = makeAsyncActionTypes('API/CREATE_ZONE');
export const createZone = makeAsyncActionCreators(CREATE_ZONE);

export const DELETE_ZONE = makeAsyncActionTypes('API/DELETE_ZONE');
export const deleteZone = makeAsyncActionCreators(DELETE_ZONE);

export const CLEAR_LOCATION = makeAsyncActionTypes('API/CLEAR_LOCATION');
export const clearLocation = makeAsyncActionCreators(CLEAR_LOCATION);

export const DELETE_AISLE = makeAsyncActionTypes('API/DELETE_AISLE');
export const deleteAisle = makeAsyncActionCreators(DELETE_AISLE);

export const REMOVE_SECTION = makeAsyncActionTypes('API/REMOVE_SECTION');
export const removeSection = makeAsyncActionCreators(REMOVE_SECTION);

export const GET_ZONE_NAMES = makeAsyncActionTypes('API/GET_ZONE_NAMES');
export const getZoneNames = makeAsyncActionCreators(GET_ZONE_NAMES);

export const GET_CLUB_CONFIG = makeAsyncActionTypes('API/GET_CLUB_CONFIG');
export const getClubConfig = makeAsyncActionCreators(GET_CLUB_CONFIG);

export const GET_ITEM_DETAIL_UPC = makeAsyncActionTypes('API/GET_ITEM_DETAIL_UPC');
export const getItemDetailsUPC = makeAsyncActionCreators(GET_ITEM_DETAIL_UPC);

export const ADD_PALLET_UPCS = makeAsyncActionTypes('API/ADD_PALLET_UPCS');
export const addPalletUPCs = makeAsyncActionCreators(ADD_PALLET_UPCS);

export const UPDATE_PALLET_ITEM_QTY = makeAsyncActionTypes('API/PATCH_PALLET_ITEM_QTY');
export const updatePalletItemQty = makeAsyncActionCreators(UPDATE_PALLET_ITEM_QTY);

export const DELETE_UPCS = makeAsyncActionTypes('API/DELETE_UPCS');
export const deleteUpcs = makeAsyncActionCreators(DELETE_UPCS);

export const COMBINE_PALLETS = makeAsyncActionTypes('API/PATCH_COMBINE_PALLETS');
export const combinePallets = makeAsyncActionCreators(COMBINE_PALLETS);

export const PRINT_PALLET_LABEL = makeAsyncActionTypes('API/PRINT_PALLET_LABEL');
export const printPalletLabel = makeAsyncActionCreators(PRINT_PALLET_LABEL);

export const CLEAR_PALLET = makeAsyncActionTypes('API/CLEAR_PALLET');
export const clearPallet = makeAsyncActionCreators(CLEAR_PALLET);

export const GET_PALLET_DETAILS = makeAsyncActionTypes('API/GET_PALLET_DETAILS');
export const getPalletDetails = makeAsyncActionCreators(GET_PALLET_DETAILS);

export const POST_BIN_PALLETS = makeAsyncActionTypes('API/POST_BIN_PALLETS');
export const binPallets = makeAsyncActionCreators(POST_BIN_PALLETS);

export const GET_PALLET_CONFIG = makeAsyncActionTypes('API/GET_PALLET_CONFIG');
export const getPalletConfig = makeAsyncActionCreators(GET_PALLET_CONFIG);

export const UPDATE_PICKLIST_STATUS = makeAsyncActionTypes('API/UPDATE_PICKLIST_STATUS');
export const updatePicklistStatus = makeAsyncActionCreators(UPDATE_PICKLIST_STATUS);

export const UPDATE_PICKLIST_STATUS_V1 = makeAsyncActionTypes('API/UPDATE_PICKLIST_STATUS_V1');
export const updatePicklistStatusV1 = makeAsyncActionCreators(UPDATE_PICKLIST_STATUS_V1);

export const GET_PICKLISTS = makeAsyncActionTypes('API/GET_PICKLISTS');
export const getPicklists = makeAsyncActionCreators(GET_PICKLISTS);

export const UPDATE_PALLET_NOT_FOUND = makeAsyncActionTypes('API/UPDATE_PALLET_NOT_FOUND');
export const updatePalletNotFound = makeAsyncActionCreators(UPDATE_PALLET_NOT_FOUND);

export const CREATE_NEW_PICK = makeAsyncActionTypes('API/CREATE_NEW_PICK');
export const createNewPick = makeAsyncActionCreators(CREATE_NEW_PICK);

export const CREATE_NEW_PICK_V1 = makeAsyncActionTypes('API/CREATE_NEW_PICK_V1');
export const createNewPickV1 = makeAsyncActionCreators(CREATE_NEW_PICK_V1);

export const POST_CREATE_PALLET = makeAsyncActionTypes('API/POST_CREATE_PALLET');
export const postCreatePallet = makeAsyncActionCreators(POST_CREATE_PALLET);

export const REPORT_MISSING_PALLET = makeAsyncActionTypes('API/REPORT_MISSING_PALLET');
export const reportMissingPallet = makeAsyncActionCreators(REPORT_MISSING_PALLET);

export const GET_ITEM_PALLETS = makeAsyncActionTypes('API/GET_ITEM_PALLETS');
export const getItemPallets = makeAsyncActionCreators(GET_ITEM_PALLETS);

export const GET_ITEM_PALLETS_V1 = makeAsyncActionTypes('API/GET_ITEM_PALLETS');
export const getItemPalletsV1 = makeAsyncActionCreators(GET_ITEM_PALLETS_V1);

export const UPDATE_MULTI_PALLET_UPC_QTY = makeAsyncActionTypes('API/UPDATE_MULTI_PALLET_UPC_QTY');
export const updateMultiPalletUPCQty = makeAsyncActionCreators(UPDATE_MULTI_PALLET_UPC_QTY);

export const SUBMIT_FEEDBACK_RATING = makeAsyncActionTypes('API/SUBMIT_FEEDBACK_RATING');
export const submitFeedbackRating = makeAsyncActionCreators(SUBMIT_FEEDBACK_RATING);

export const GET_USER_CONFIG = makeAsyncActionTypes('API/GET_USER_CONFIG');
export const getUserConfig = makeAsyncActionCreators(GET_USER_CONFIG);

export const UPDATE_USER_CONFIG = makeAsyncActionTypes('API/UPDATE_USER_CONFIG');
export const updateUserConfig = makeAsyncActionCreators(UPDATE_USER_CONFIG);

export const UPDATE_MULTI_PALLET_UPC_QTY_V2 = makeAsyncActionTypes('API/UPDATE_MULTI_PALLET_UPC_QTY_V2');
export const updateMultiPalletUPCQtyV2 = makeAsyncActionCreators(UPDATE_MULTI_PALLET_UPC_QTY_V2);
